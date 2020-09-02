import React from 'react'

function HistoryPage(props) {
    const isPC = function(){
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];  
        var flag = true;  
        for (var v = 0; v < Agents.length; v++) {  
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
        }  
        return flag;
      }();

    return (
        <div style={{ width: isPC? '80%':'98%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>History</h1>
            </div>
            <br />
            { isPC ? 
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Time</th>
                            <th>Reason</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.user.userData && props.user.userData.history &&
                            props.user.userData.history.map(item => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.price}</td>
                                    <td>{item.dateOfDelete}</td>
                                    <td>{item.reason}</td>
                                </tr>
                            ))}
                    </tbody>
                    
                </table> :
                <table style={{ tableLayout: "fixed" }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Time</th>
                            <th>Reason</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.user.userData && props.user.userData.history &&
                            props.user.userData.history.map(item => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.dateOfDelete}</td>
                                    <td>{item.reason}</td>
                                </tr>
                            ))}
                    </tbody>
                    
                </table>
            }
            
        </div>
    )
}

export default HistoryPage
