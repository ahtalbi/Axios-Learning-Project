import axios from "axios";

async function getItems() {
    let res = await axios.get("https://dummyjson.com/recipes");
    console.log(res.data);
}

getItems();