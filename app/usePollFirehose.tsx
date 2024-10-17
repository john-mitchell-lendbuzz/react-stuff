import {useState, useEffect} from 'react';

const usePollFirehose = (interval: number) => {
    const [data, setData] = useState(null);
    const baseUrl = `${process.env.DEV_BOX_URL}/firehose/events`;
    let lastEventId = 2169606628;
  
    useEffect(() => {
      const fetchData = async() => {
        const response = await fetch(`${baseUrl}?lastEventId=${lastEventId}`);
        const data = await response.json();
        //lastEventId = data.max_event_id;
        setData(data);
      };

      fetchData();
      setInterval(fetchData, interval);
    }, [interval]);
  
    return data;
  }
  
  export default usePollFirehose;