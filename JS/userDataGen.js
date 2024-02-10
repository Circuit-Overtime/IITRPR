const firebaseConfig = {
    apiKey: "AIzaSyCETWF6huNg2yy3rXJOXMzqvNe6G7xAE9Y",
    authDomain: "farmercrop-27a47.firebaseapp.com",
    projectId: "farmercrop-27a47",
    storageBucket: "farmercrop-27a47.appspot.com",
    messagingSenderId: "71580088035",
    appId: "1:71580088035:web:58d8f79d25ce5573ecf7d6"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  let timer;
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;



  
  today  = new Date();
  var date = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear() ; //gives the  current date to the system

document.getElementById("login").addEventListener("click",() => {
    document.querySelector(".registerForm").style.top = "150%";
    document.querySelector(".loginForm").style.top = "50%";
})

document.getElementById("register").addEventListener("click",() => {
    document.querySelector(".registerForm").style.top = "50%";
    document.querySelector(".loginForm").style.top = "150%";
})

document.getElementById("name-containerReg").addEventListener("keyup", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        globalThis.userNameReg = document.getElementById("name-containerReg").value.toLowerCase();
        isUser(userNameReg);
    
        }, 500);
        
        document.getElementById("name-containerReg").value.length == 0 ? document.querySelector(".registerForm > .name-container > .validUserName").style.opacity = "0" : null;
})


document.getElementById("signup_button").addEventListener("click", () => {
    const regName = document.getElementById("name-containerReg").value;
    const regEmail = document.getElementById("email-containerReg").value;
    const regPass = document.getElementById("password-containerReg").value;
    
        if(isEmail(regEmail))
        {
            if((isPassword(regPass)))
            {
                document.querySelector(".loaderMask").style.zIndex = "100";
                document.querySelector(".loaderMask").style.opacity = "1";
                //create account of the user
                firebase.auth().createUserWithEmailAndPassword(regEmail, regPass)
                .then((userCredential) => {
                    var user = userCredential.user //contains the user credentials
                    db.collection('users').doc(regName.toLowerCase().trim()).set({
                        username : regName.toLowerCase().trim(),
                        password : regPass,
                        email : regEmail,
                        uid : user.uid,
                        displayName : regName,
                        dateCreated: date,
                        region : "West Bengal",
                        user_logo: "https://firebasestorage.googleapis.com/v0/b/psswdmanager-68a29.appspot.com/o/OfficialFiles%2Fuser_logo_defualt.jpg?alt=media&token=2e4e1159-2536-4f9e-866d-f9942f9e2d3d",
                    })
                    .then(() => {
                        //do the needful to bring up the login page
                        
                        document.getElementById("name-containerReg").value = "";
                        document.getElementById("email-containerReg").value = "";
                        document.getElementById("password-containerReg").value = "";
                        document.getElementById("confirmPassword-containerReg").value = "";


                        document.querySelector(".loaderMask").style.zIndex = "-1";
                        document.querySelector(".loaderMask").style.opacity = "0";
                        document.querySelector(".registerForm").style.top = "150%";
                        document.querySelector(".loginForm").style.top = "50%";

                    })
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    errorMessage == "The email address is already in use by another account." ? typeWriterErrorHTML("errorMessage","The email address is already in use"): typeWriterErrorHTML("errorMessage", errorMessage);
                    
                  });
            }
            else if(!(isPassword(regPass)))
            {
                typeWriterErrorHTML("errorMessage", "Password don't match");
            }
        }
        else if(isEmail(regEmail) == false)
        {
            typeWriterErrorHTML("errorMessage", "Invalid EMail Address");
        }
    
})


document.getElementById("signin_btn").addEventListener("click", () =>{
    const loginName = document.getElementById("signinNameinp").value.trim().toLowerCase();
    const loginPass = document.getElementById("signinPasswordInp").value;
    document.querySelector(".loaderMask").style.zIndex = "100";
    document.querySelector(".loaderMask").style.opacity = "1";
    if(loginName != "")
    {
        db.collection("users").doc(loginName).get().then((doc) => {
            if (doc.exists) {
                console.log(doc.data());
                if(doc.data().password != loginPass)
                {
                    typeWriterErrorHTML("errorMessageLogin", "Wrong Password");
                    document.querySelector(".loaderMask").style.zIndex = "-1";
                    document.querySelector(".loaderMask").style.opacity = "0";
                }
                else
                {   
                    sessionStorage.setItem("userRegion", doc.data().region);
                    location.replace("homepage.html");
    
                }
            }
            else
            {
                typeWriterErrorHTML("errorMessageLogin", "Account Doesn't Exist, Sign Up")
                document.querySelector(".loaderMask").style.zIndex = "-1";
                document.querySelector(".loaderMask").style.opacity = "0";
            }
        })
        
    }
    else 
    {
        typeWriterErrorHTML("errorMessageLogin", "Insufficient Information")
    }
    
})

function isUser(userName)
{
    if(userName.trim() != "")
    {
        var usrFind = db.collection("users").doc(userName);
        usrFind.get().then((doc) => {
            if(doc.exists)
            {
                document.querySelector(".registerForm > .name-container > .validUserName").style.opacity = "0"
                document.getElementById("name-containerReg").style.color = "red";
                typeWriterErrorHTML("errorMessage", "This Username Exists");
                return false;
            }
            else
            {
                document.getElementById("name-containerReg").style.color = "#3b3b3b";
                document.querySelector(".registerForm > .name-container > .validUserName").style.opacity = "1"
                return true;
            }
        });
    }
    else
    {
        return false;
    }
    if(userName.length < 5)
    {
        return false;
    }
}

function isEmail(emailAdress){

    emailAdress = document.getElementById("email-containerReg").value;
    if (emailAdress.match(regex)) 
    return true;
    else 
    {
        return false; 
    }
    
    }
    
    document.getElementById("email-containerReg").addEventListener("input", () => {
        var emailReg = document.getElementById("email-containerReg").value;
        if(isEmail(emailReg) == true)
        {
        document.getElementById("validEmail").style.opacity = "1";
        }
        else
        {
            document.getElementById("validEmail").style.opacity = "0";
    
        }
        emailReg.length == 0 ? document.getElementById("validEmail").style.opacity = "0" : null;
    })

function isPassword(pass)
{
    regconfPass = document.getElementById("confirmPassword-containerReg").value;
    console.log(pass.length)
    if((pass.length >= 6) && (pass == regconfPass))
    {   
        return true;
    }
    else 
    {
        return false;
    }

}

document.getElementById("password-containerReg").addEventListener("input", () => {
    regPass = document.getElementById("password-containerReg").value;
    regconfPass = document.getElementById("confirmPassword-containerReg").value;
    if(isPass(regPass))
    {
        document.getElementById("validPassword").style.opacity = "0";
        document.getElementById("validPasswordConf").style.opacity = "0";
    }
    else
    {
        document.getElementById("validPassword").style.opacity = "1";
        document.getElementById("validPasswordConf").style.opacity = "1";
    }


})

document.getElementById("confirmPassword-containerReg").addEventListener("input", () => {
    regPass = document.getElementById("password-containerReg").value;
    regconfPass = document.getElementById("confirmPassword-containerReg").value;
    if(isPass(regPass))
    {
        document.getElementById("validPassword").style.opacity = "0";
        document.getElementById("validPasswordConf").style.opacity = "0";
    }
    else
    {
        document.getElementById("validPassword").style.opacity = "1";
        document.getElementById("validPasswordConf").style.opacity = "1";
    }


})




function typeWriterErrorHTML(idOfTextHolder, textToType, speed) {
    var i = 0;
    var speed = speed || 25; // Default speed if not provided
    document.getElementById(idOfTextHolder).innerHTML = "";
    function type() {
        if (i < textToType.length) {
            document.getElementById(idOfTextHolder).innerHTML += textToType.charAt(i);
            i++;
            setTimeout(type, speed);
        }
         if(i == textToType.length )
         {
            setTimeout(() => {
                document.getElementById(idOfTextHolder).innerHTML = "";
            }, 1500);
         }
    }
    type(); // Call the function to start the typing effect
}