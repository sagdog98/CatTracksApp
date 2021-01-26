import expect from 'expect'; 
import Stops from '';
import moment from "moment";
// import nextTime from "nextTime"

describe(`check if next time is right`, () => {
    it(`scenerio 1`, () => {
        // call on stops login 
        const time = moment();
        const stop_id = 0; 
        const line = 'C1';
        const expected_time =  '89 min'; 

        console.log(`${time} ${stop_id} ${line} ${expected_time}`)
        const nextTime = nextTime(time, stop_id, line); 
        expect(nextTIme).toBeAn.String('.'); 
    })

})
// Tuesday 10am, Muir Pass, C1
// Sunday 10pm, Muir Pass, E1
// Sunday Noon, Muir Pass, E2
// Wedneday 5am, 9am , Heritage Express, 