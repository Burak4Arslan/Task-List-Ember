import Controller from '@ember/controller';

sessionStorage.removeItem("user");

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
                    } else {
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
                return;
            }

            var loginRequest = new XMLHttpRequest();
            loginRequest.onreadystatechange = () => { 
                if (loginRequest.readyState == 4 && loginRequest.status == 200){

                    if(!(loginRequest.response)) {
                        alert("Username and Password do not Match!");
                        return;
                    }

                    let user = {
                        "name":username,
                        "password":password
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
