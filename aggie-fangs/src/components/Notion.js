import React, {useState, useEffect} from "react";
const {Client} = require('@notionhq/client')

const notion = new Client({auth: process.env.NOTION_API_KEY})
console.log("IN THE NOTION.JS file, component")

/*  async function getDatabase(){
    //console.log(process.env.NOTION_DATABASE_ID)
    const  response =  await notion.databases.retrieve({ database_id:
         process.env.NOTION_DATABASE_ID
    })
    console.log(response)

    return response
} */

export default () => {
/*     const [count, setCount] = useState(0);
    const [notion, setNotion] = useState(null);
    useEffect (async () =>{
        const response = await notion.databases.retrieve({ database_id:
            process.env.NOTION_DATABASE_ID
        })
        console.log(response);
        const data = await response.json();
        const [item] = data.results;
        setNotion(item);
    }, []); */
    const [notion, setNotion] = useState([]);
    useEffect(() => {
        fetch("/notion/").then(res => {
            if(res.ok) {
                console.log("the response was ok");
                console.log(res.text());
                //Content( JsonConvert.SerializeObject(battle), "application/json" );
                return res.text();
            }else{
                console.log("the response was NOT ok");

            }
        }).then(res => setNotion(res.result))

        console.log()
    }) 
    return (<div>
        {"BACKEND RESPONSE IS VISIBLE IN CONSOLE"}
       <h1>{notion}</h1> 
    </div>)
  };



/* function Notion() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch("/notion/").then(res => {
            if(res.ok) {
                console.log("the response was ok");
                return res.json()
            }
        }).then(jsonRes => setUsers(jsonRes.usersList))
    }) 

    return (<div>
        {"THIS THE BACKEND"}
        {users.map(user =><li>{users} </li>)}
    </div>)
}
export default Notion; */