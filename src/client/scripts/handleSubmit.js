import axios from "axios";
const form= document.querySelector("form");





const handleSubmit=(e)=>{
    e.preventDefault();
    const Location=getCity();
}
const getCity=async()=>{
    const {data}=await axios.post("http://localhost:8000/getCity",form,{
        headers:{
            "Content-Type": "application/json",
        }
    })
    return data
}
export{handleSubmit}