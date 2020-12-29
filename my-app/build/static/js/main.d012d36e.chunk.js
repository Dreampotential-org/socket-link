(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{111:function(e,t){},113:function(e,t){},160:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(22),l=a.n(r),i=(a(98),a(31)),u=a(32),o=a(42),c=a(37),m=a(36),h=(a(99),a(100),a(163)),v=a(87),p=a(9),g=function(e){return s.a.createElement("p",null,e.user)},E=new WebSocket("ws://localhost:3333"),d=function(e){Object(c.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={expireUser:null,allUser:null,userMessage:null},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){this.setState({allUser:this.props.users,userMessage:this.props.usertextMessage})}},{key:"render",value:function(){var e=this;return this.props.users.length?s.a.createElement("div",{className:"listOfActiveUsers"},s.a.createElement("h5",null,s.a.createElement("b",null,"Currently Exploring")),this.state.allUser&&this.state.allUser.map((function(t,a){return s.a.createElement("div",{className:"expire-section"},s.a.createElement(g,{user:t}),s.a.createElement(p.a,{onClick:function(){return function(t,a){for(var n in e.state.allUser)if(e.state.allUser[n]==a){e.state.allUser.splice(n,1),E.onmessage=function(e){var t=JSON.parse(e.data);t.activeUsers.splice(n,1);if(t&&t.activeUsers.length<3){t.activeUsers.push(t.users[0]);t.users.shift()}};break}}(0,t)}},"Expire"))}))):null}}]),a}(s.a.Component),f=function(e){return s.a.createElement("p",null,e.user)},U=function(e){Object(c.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={userMessage:null},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){this.setState({userMessage:this.props.usertextMessage})}},{key:"render",value:function(){return this.props.users.length?s.a.createElement("div",{className:"listOfQueueUsers"},s.a.createElement("h5",null,s.a.createElement("b",null,"Waiting in the Queue")),this.props.users.map((function(e){return s.a.createElement("div",null,s.a.createElement(f,{user:e}))}))):null}}]),a}(s.a.Component),y=a(14),b=a(27),w=a(26),S=(a(101),a(131),new WebSocket("ws://localhost:3333")),k=function(e){Object(c.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).joinQueue=n.joinQueue.bind(Object(o.a)(n)),n.leaveQueue=n.leaveQueue.bind(Object(o.a)(n)),n.state={user:null,videoURL:null,users:null,activeUsers:null,queueUsers:null,showEnter:!1,showTimesUp:!1,isInQueue:!1,name:null,roomName:null,userMessage:null,getTimeSet:null,brodCastText:null,userMessageQueue:""},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){var e=this;S.onopen=function(){console.log("connection open")},S.onmessage=function(t){if(console.log("event =>",t),"u"===t.data[3]){var a=t.data&&JSON.parse(t.data);a.activeUsers&&a.activeUsers.length,e.setState({users:a,activeUsers:a.activeUsers,queueUsers:a.users,getTimeSet:a.timeStamp})}else if("v"===t.data[2]){var n=JSON.parse(t.data);e.setState({showEnter:!0,videoURL:n.videoUrl})}else"T"===t.data[2]&&e.setState({showTimesUp:!0})},S.onerror=function(e){console.error("Socket encountered error: ",e.message,"Closing socket"),S.close()}}},{key:"joinQueue",value:function(e){if(e&&e.activeUsers&&e.users)this.setState({name:e});else if(this.state.name.length>0){var t={name:this.state.name,userMessage:this.state.userMessage,roomName:this.state.roomName};S.send(JSON.stringify(t)),this.setState({isInQueue:!0,user:"playaName",userMessageQueue:this.state.userMessage})}}},{key:"leaveQueue",value:function(){}},{key:"ExpireData",value:function(e){e&&e.activeUsers.map((function(e){S.send(e)}))}},{key:"sendBroadcast",value:function(){console.log("click to send broadcast message")}},{key:"render",value:function(){var e=this;return this.state.showEnter||this.state.showTimesUp||null==this.state.activeUsers||null==this.state.queueUsers?this.state.showEnter?s.a.createElement(w.a.Dialog,null,s.a.createElement(w.a.Body,null,"You may now enter the 3D verse!"),s.a.createElement(w.a.Footer,null,s.a.createElement(p.a,{variant:"primary",href:this.state.videoURL,onClick:function(){e.setState({showEnter:!1})},target:"_blank"},"Enter"),s.a.createElement(p.a,{variant:"primary",onClick:function(){e.setState({showEnter:!1})}},"Close"))):this.state.showTimesUp?s.a.createElement(w.a.Dialog,null,s.a.createElement(w.a.Body,null," Times Up!"),s.a.createElement(w.a.Footer,null,s.a.createElement(p.a,{variant:"primary",onClick:function(){e.setState({showTimesUp:!1})}},"Close"))):this.state.showEnter||this.state.showTimesUp||null==this.state.activeUsers||null==this.state.queueUsers||!this.state.isInQueue?s.a.createElement(y.a,null,s.a.createElement(b.a,null,s.a.createElement(y.a.Toggle,{id:"queueToggle",as:p.a,variant:"primary",eventKey:"1"},"Enter The 3D Verse"),s.a.createElement(y.a.Collapse,{eventKey:"1"},s.a.createElement(b.a.Body,null,s.a.createElement("div",{id:"userLists"}),s.a.createElement(p.a,{onClick:this.joinQueue},"Join Queue"))))):s.a.createElement(y.a,null,s.a.createElement(b.a,null,s.a.createElement(y.a.Toggle,{id:"queueToggle",as:p.a,variant:"primary",eventKey:"1"},"Enter The 3D Verse"),s.a.createElement(y.a.Collapse,{eventKey:"1"},s.a.createElement(b.a.Body,null,s.a.createElement("div",{id:"userLists"},s.a.createElement(d,{users:this.state.activeUsers}),s.a.createElement(U,{users:this.state.queueUsers})),s.a.createElement("div",null,s.a.createElement("p",null,s.a.createElement("b",null,"Number of people waiting Leave: ",this.state.queueUsers.length.toString())),s.a.createElement(p.a,{onClick:this.leaveQueue},"Leave")))))):s.a.createElement(y.a,null,s.a.createElement(b.a,null,s.a.createElement(y.a.Toggle,{id:"queueToggle",as:p.a,variant:"primary",eventKey:"1"},"Enter The 3D Verse"),s.a.createElement(y.a.Collapse,{eventKey:"1"},s.a.createElement(b.a.Body,null,s.a.createElement("div",null,s.a.createElement(h.a.Label,null,"Room Name"),s.a.createElement(v.a,{placeholder:"RoomName","aria-label":"RoomName",onChange:function(t){return a=t,e.setState({roomName:a.target.value}),void a.preventDefault();var a},style:{marginBottom:"10px",marginTop:"10px",width:"8%"},defaultValue:this.state.roomName}),s.a.createElement(h.a.Label,null,"Name"),s.a.createElement(v.a,{placeholder:"Name","aria-label":"Name",onChange:function(t){return a=t,e.setState({name:a.target.value}),void a.preventDefault();var a},style:{marginBottom:"10px",marginTop:"10px",width:"8%"}}),s.a.createElement(h.a.Label,null,"Message"),s.a.createElement(v.a,{placeholder:"Message","aria-label":"Send Message",onChange:function(t){return a=t,e.setState({userMessage:a.target.value}),void a.preventDefault();var a},style:{marginBottom:"10px",marginTop:"10px",width:"8%"}})),s.a.createElement("div",{id:"userLists"},s.a.createElement(d,{users:this.state.activeUsers,usertextMessage:this.state.userMessage}),s.a.createElement(U,{users:this.state.queueUsers,getTimeSet:this.state.getTimeSet})),s.a.createElement("div",null,s.a.createElement("p",null,s.a.createElement("b",null,"Number of people waiting join: ",this.state.queueUsers.length.toString())),s.a.createElement(p.a,{onClick:this.joinQueue},"Join"),s.a.createElement("h3",null,"Broadcast"),s.a.createElement(v.a,{placeholder:"Broadcast","aria-label":"Broadcast",onChange:function(t){return a=t,e.setState({brodCastText:a.target.value}),void a.preventDefault();var a},style:{marginBottom:"10px",marginTop:"10px",width:"8%"}}),s.a.createElement(p.a,{id:"sendMessage",onClick:this.sendBroadcast},"Send"))))))}}]),a}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(k,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},93:function(e,t,a){e.exports=a(160)},98:function(e,t,a){},99:function(e,t,a){}},[[93,1,2]]]);
//# sourceMappingURL=main.d012d36e.chunk.js.map