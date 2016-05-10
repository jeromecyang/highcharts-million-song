import sys, os, glob, hdf5_getters, json

fields = ["artist_latitude", "artist_location", "artist_longitude", "artist_name", "danceability", "duration", "energy", "key", "loudness", "song_hotttnesss", "tempo", "title", "year"]

def get_songs(basedir,ext='.h5') :
    songs = []
    for root, dirs, files in os.walk(basedir):
        files = glob.glob(os.path.join(root,'*'+ext))
        for f in files:
            h5 = hdf5_getters.open_h5_file_read(f)
            obj = {}
            for field in fields:
                obj[field] = getattr(hdf5_getters, 'get_'+field)(h5)
		if type(obj[field]).__name__ == 'int32':
		    obj[field] = int(obj[field])
            songs.append(obj)
            h5.close()
    return songs
    
songs = get_songs(sys.argv[1])
f = open(sys.argv[2], 'w')
f.write(json.dumps(songs))
f.close()
