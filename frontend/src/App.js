import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";

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

  // this one is using the local storage which doesn't give load to the usestate and also all the changes made will appear 
  // on the page
  const [reminderList, setReminderList] = useState(getLocalData());//instead of giving empty array pass a func which gets data
  
  //now the below thing is to get all reminders whenever there is a change made i.e added or website reloaded as such
  // useEffect(()=>{//for that we make a get request to our specified route which will return a response to our frontend
  //   axios.get('http://localhost:5000/getreminders')
  //   .then((response) =>{
  //     // console.log(response.data);//to verify whether we are getting the data or not
  //     setReminderList(response.data);
  //   })
  // },[])

  const addReminder=() =>{
      const mynewipdata={
        id: new Date().getTime().toString(),
        name:reminderMsg,
        remindtime:remindAt,
      };
      axios.post('http://localhost:5000/addreminder',{
        id:mynewipdata.id,
        name:mynewipdata.name,
        remindtime:mynewipdata.remindtime,
      }).then(()=>{//if data is added succefully then send a message to whatsapp message saying reminder added
        console.log("Reminder Added Successfully");
        setReminderList([...reminderList, mynewipdata]);//then push the reminder data into the reminderList
          axios.post('http://localhost:5000/chat',{
            todo:"Reminder Added Successfully"
          })
          //after adding the reminder the fields shld become so that we can add another reminder so set them to empty
          setRemindAt();
          setReminderMsg("");
      })
  };
  //this func deletes the reminder from the localstorage
  const localdel=(index)=>{
    const updatedList=reminderList.filter((reminder) =>{
      return reminder.id !== index;
    })
    setReminderList(updatedList)
  }
  //this is for deleting the reminder 
  const deleteReminder=async(id)=>{
    //whenver user clicks on delete button this func will execute in which we are making a delete req with the reminder id
    await axios.delete(`http://localhost:5000/deletereminder/${id}`).then((res)=>{
      //when it returns a promise then it means the req has been processed now we need to also remove that reminder from list too
      //so for that run filter func in which we return a new list without that reminder
      console.log("Deleted successfully");
      })
      localdel(id);//delete from local storage too
  }

  // this is the local storage
  useEffect( () =>{
    localStorage.setItem("MyreminderList", JSON.stringify(reminderList));//when you store in reminderList also push it into local storage
  },[reminderList])


  //the below thing will run for every 1second 
  useEffect(() => {
    const interval = setInterval(() => {
        //iterate through the array and check their date and time details
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
            required
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
            required
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
              </div>
            ))
        }    
        </div>
      </div>
    </div>
  );
}
export default App;
