import web, json, numpy

songs = json.load(open("songs.json"))
        
urls = (
    '/(.*)', 'main'
)
app = web.application(urls, globals())

class main:        
    def GET(self, name):
        web.header('Content-Type', 'application/json')
	web.header('Access-Control-Allow-Origin', '*')
	web.header('Access-Control-Allow-Credentials', 'true')
	
	path = name.split("/")
        task = path[0]
        params = path[1].split(",")
        return globals()[task](*params)

if __name__ == "__main__":
    app.run()

#task: aggregate
def aggregate_by_field(value_field, method, group_by_field):
    grouped_values = group_values(value_field, group_by_field)
    return flatten_grouped_values(grouped_values, method)

def group_values(value_field, group_by_field):
    obj = {}
    for song in songs:
	if not song[group_by_field] in obj:
		obj[song[group_by_field]] = []
	obj[song[group_by_field]].append(song[value_field])
    return obj

def flatten_grouped_values(grouped_values, method):
    output = []
    for key in grouped_values:
	values = [v for v in grouped_values[key] if v != None]
	output.append({ 'label': key, 'value': sum(values)/len(values) })
    return output

#task: get top N records after sorted by a field
def get_top_n_sorted_by_field(field, n=10):
    return sorted(songs, key=lambda x: x[field], reverse=True)[:int(n)]

#task: histogram
def get_histogram(field, bins='10'):
    histo = numpy.histogram([s[field] for s in songs], bins=int(bins))
    output = []
    for i in range(len(histo[0])):
        output.append({'count':histo[0][i],'min':histo[1][i],'max':histo[1][i+1]})
    return output

#task: get unique values and counts
def get_unique_values_and_counts(field, top_n='10'):
    output = {}
    for s in songs:
        if not s[field] in output:
            output[s[field]] = 0
        output[s[field]] += 1
    output_list = sorted([{'value':key,'count':output[key]} for key in output],
                         key=lambda x: x['count'], reverse=True)
    if top_n == 'all':
        return output_list
    else:
        return output_list[:int(top_n)]
