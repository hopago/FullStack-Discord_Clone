import axios from 'axios';

export default axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

// axios call example

{/*
  const url = '/server/:serverId',
  
  const fetchData = async () => {
    try {
        const res = await axios.post(
            url, 
            { userId, serverId ...etc }, 
            {
                headers: {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            }
        );

        // See Data...
        console.log(res.data);
        console.log(res.accessToken);
        console.log(JSON.stringify(res));
    } catch (err) {
        handler err
    }
  }
*/}