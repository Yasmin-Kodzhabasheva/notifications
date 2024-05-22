import { useEffect, useState } from "react";

const useFetch = () => {
    const url = 'http://localhost:3000/threads'
    const [data, setData] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) throw Error('Error fetching  data');

                return res.json();
            })
            .then(data => {
                setData(data)
            })
            .catch(err => {
                setError(err)
            })
    },[])

    return {data, error};

}

export default useFetch;