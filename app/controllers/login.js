import Controller from '@ember/controller';

sessionStorage.removeItem("user");
let userSign;
export default Controller.extend({
    actions: {
        signin: function() {
            let username;
            let password;
            username = document.getElementById("username").value;
            password = document.getElementById("password").value;
            username = username.trim();
            password = password.trim();
            if(!(username && password)) {
                alert("Username or Password cannot be empty");
                userSign.style.color = "red";
                return;
            }

            let user = {
                "name":username,
                "password":password
            }

            var postUserRequest = new XMLHttpRequest();
            postUserRequest.onreadystatechange = () => { 
                if (postUserRequest.readyState == 4 && postUserRequest.status == 200){

                    if(!(postUserRequest.response)) {
                        alert("Username is already Taken");
                        userSign = document.getElementById("userSignSpan");
                        userSign.style.color = "red";
                    } else {
                        userSign = document.getElementById("userSignSpan");
                        userSign.style.color = "green";
                        alert("Signing in Successful")
                    }

                }
            }
            postUserRequest.open("POST","http://localhost:4040/users", true);
            postUserRequest.setRequestHeader("Content-Type", "application/json");
            postUserRequest.send(JSON.stringify(user));

        },
        login: function() {
            let username;
            let password;
            username = document.getElementById("username").value;
            password = document.getElementById("password").value;

            if(!(username && password)) {
                alert("Username or Password cannot be empty");
                userSign = document.getElementById("userSignSpan");
                userSign.style.color = "red";
                return;
            }

            var loginRequest = new XMLHttpRequest();
            loginRequest.onreadystatechange = () => {
                if (loginRequest.readyState == 4 && loginRequest.status == 200){
                    if(!(loginRequest.response)) {
                        alert("Check Username or Password Again!");
                        userSign = document.getElementById("userSignSpan");
                        userSign.style.color = "red";
                        return;
                    }
                    userSign = document.getElementById("userSignSpan");
                    userSign.style.color = "green";
                    let user = {
                        "name":username,
                        "password":password,
                        "completedTasks":JSON.parse(loginRequest.response).completedTasks
                    }

                    sessionStorage.setItem("user",JSON.stringify(user));
                    window.location.href = "/tasks"
                }
            }
            loginRequest.open("GET","http://localhost:4040/users?username="+username+"&password="+password, true);
            loginRequest.setRequestHeader("Content-Type", "application/json");
            loginRequest.send();
        }
    }

});
