import AsyncIteratorDemuxer from "async-iterator-demuxer"
import Defer from "p-defer"
import Ruuvi from "node-ruuvitag"

var
  results= [],
  wakeup

function start(){
	ruuvi.on( "found", function( tag){
		tag.on( "updated", function( data){
			// store data
			data.tag= tag.id
			queue.push( data)

			// let waiting party know they have data
			if( wakeup){
				var woke= wakeup
				wakeup = null
				woke.resolve()
			}
		})
	})
}


export default = AsyncIteratorDemuxer(async function*(){
	start()
	while( true){
		// read all current results
		while( results.length){
			yield results.shift()
		}
		// wait for more results
		if( !wakeup){
			wakeup= Defer()
		}
		await wakeup.promise
	}
})
