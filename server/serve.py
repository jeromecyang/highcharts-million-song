import web, json

songs = json.load(open("songs.json"))
        
urls = (
    '/(.*)', 'hello'
)
app = web.application(urls, globals())

class hello:        
    def GET(self, name):
        web.header('Content-Type', 'application/json')
	web.header('Access-Control-Allow-Origin', '*')
	web.header('Access-Control-Allow-Credentials', 'true')
	path = name.split("/")
	if path[0] == "aggregate":
            output = aggregate(path[1:])
        return json.dumps(output)

if __name__ == "__main__":
    app.run()

def aggregate(path):
    params = path[0].split(",")
    method = params[0]
    value_field = params[1]
    group_by_field = params[2]
    
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
