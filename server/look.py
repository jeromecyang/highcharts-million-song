import json, numpy

songs = json.load(open("songs.json"))

#get top N records after sorted by a field
def get_top_n_sorted_by_field(field, n):
    return sorted(songs, key=lambda x: x[field], reverse=True)[:n]

#histogram
def get_histogram(field):
    histo = numpy.histogram([s[field] for s in songs])
    output = []
    for i in range(len(histo[0])):
        output.append({'count':histo[0][i],'min':histo[1][i],'max':histo[1][i+1]})
    return output

#get unique values and counts
def get_unique_values_and_counts(field):
    output = {}
    for s in songs:
        if not s[field] in output:
            output[s[field]] = 0
        output[s[field]] += 1
    return sorted([{'value':key,'count':output[key]} for key in output],
                  key=lambda x: x['count'], reverse=True)
