// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// //#
// const socket = io('https://juchapika.site:8082'); // 웹소켓 서버 주소

// export default function Test() {
//   const [value1, setValue1] = useState('');
//   const [value2, setValue2] = useState(0);

//   useEffect(() => {
//     socket.on('message', (data) => {
//       const { battery, time } = JSON.parse(data); // 메시지 파싱
//       setValue1(battery); // value1 상태 변수에 battery 값을 할당
//       setValue2(time); // value2 상태 변수에 time 값을 할당
//     });
//     return () => {
//       socket.off('message'); // 컴포넌트 언마운트 시 이벤트 리스너 정리
//     };
//   }, []);
  

//   return (
//     <div>
//       <h1>WebSocket Receiver Example</h1>
//       <p>- battery: {value1}</p>
//       <p>- time: {value2}</p>
//     </div>
//   );
// }


import React, { useEffect } from 'react';
import * as WebSocket from 'websocket';

const Test = () => {
    useEffect(() => {
      const client = new WebSocket('wss://52.79.199.205:8082/');
  
      client.onopen = () => {
        console.log('WebSocket client connected');
      };
  
      client.onmessage = (message) => {
        const packet = message.data;
        console.log('Received packet:', packet);
  
        // Process the received packet as needed
        // ...
      };
  
      client.onclose = () => {
        console.log('WebSocket client disconnected');
      };
  
      return () => {
        client.close();
      };
    }, []);
  
    return <div>React App</div>;
  };
  
  export default Test;