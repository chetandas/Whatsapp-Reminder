import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
// import twilio from "twilio";

//getting data from local storage
const getLocalData=() =>{
  const lists=localStorage.getItem("MyreminderList")
  if(lists)//if we have data
  {
    return JSON.parse(lists)//returns in the form of array
  }
  else
  {
    return []//if no data found return empty array
  }
}

function App() {
  const [reminderMsg, setReminderMsg] = useState(""); 
  const [remindAt, setRemindAt] = useState();
  const [reminderList, setReminderList] = useState(getLocalData());//instead of giving empty array pass a func which gets data
  const [cnt, setcnt]=useState(0)//this is used to maintain the count of reminders that's it
  const addReminder=() =>{
    axios.post('http://localhost:5000/chat',{
        todo:"Reminder Added"
    })
    if(!reminderMsg)
    {
      // alert("please Fill the data");
      console.log("please fill the data");
    }
    else{
      const mynewipdata={
        id: new Date().getTime().toString(),
        name:reminderMsg,
        remindtime:remindAt,
      };
      console.log(mynewipdata.name)
      setcnt(cnt+1)//every time uh add reminder increment the cnt
      console.log(cnt+1)//this is just to verify
      setReminderList([...reminderList, mynewipdata]);//then push the reminder data into the reminderList
      setReminderMsg("");//then erase all the data so dat uh can add new reminder
      setRemindAt();
    }

  };
  const deleteReminder= (index) =>{
    const updatedList=reminderList.filter((reminder) =>{
      return reminder.id !== index
    })
    setReminderList(updatedList)
    
    //below is just to check whether working or not
    setcnt(cnt-1)//whenever uh delete a reminder then decrement the cnt
    if(cnt===1)//if uh deleted the last reminder then it means no reminders are left
     console.log("no reminders left")
    else
     console.log(cnt-1)
  }
  //adding local storage
  useEffect( () =>{
    localStorage.setItem("MyreminderList", JSON.stringify(reminderList));//when you store in reminderList also push it into local storage
    // console.log(localStorage.length)
  },[reminderList])


  //below repeats the task of checking reminders time for every second
  useEffect(() => {
    const interval = setInterval(() => {
      if(cnt===0)//if no reminders added then it means list is empty display dat
      {
         console.log("list is empty")
      }
      else
      {
        //else iterate through the array and check their date and time details
        reminderList.forEach(reminder => {
          const now=new Date()
          // console.log(now)
          // console.log(reminder.remindtime)
          if((reminder.remindtime - now) <=0)//if it is abt to remind then call post request and send that task name
          {
            axios.post('http://localhost:5000/chat',{
                todo:reminder.name
            })
            console.log("You got Reminder")//after uh send msd delete that reminder coz its reminded
            deleteReminder(reminder.id)
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  },);
  
  return (
    <div className="App">
      <div className="homepage">
        <div className="homepage_header">
          <h1> WhatsApp Reminder ⏳  </h1>
          <input
            type="text"
            placeholder="Reminder notes here...."
            value={reminderMsg}
            onChange={(e) => setReminderMsg(e.target.value)}
          />
          
          <DateTimePicker
            value={remindAt}
            onChange={setRemindAt}
            minDate={new Date()}
            minutePlaceholder="mm"
            hourPlaceholder="hh"
            dayPlaceholder="DD"
            monthPlaceholder="MM"
            yearAriaLabel="YYYY"
          />
          <div className="button" onClick={addReminder}>
            Add Reminder 
          </div>
        </div>
        <div className="homepage_body">
        {
            reminderList.map( reminder => (
              <div className="reminder_card" key={reminder.id}>
                <h2>{reminder.name}</h2>
                <h3>Remind Me at ⏰:</h3>
                <p>{String(new Date(reminder.remindtime.toLocaleString("en-US", {timezone:"Asia/Kolkata"})))}</p>
                <div className="button" onClick={() => deleteReminder(reminder.id)}>Delete</div>
                {/* <div className="button">Update</div> */}
              </div>
            ))
        }    
        </div>
      </div>
    </div>
  );
}
export default App;