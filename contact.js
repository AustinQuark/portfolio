var mail = document.getElementsByClassName("mail")[0];
mail.value = "";

document.documentElement.addEventListener("click", function(e) {
    if (mail !== e.target && !mail.contains(e.target)) {return;}
    var link = "mailto:austin.vieira@live.fr"
             + "?cc="
             + "&subject=" + encodeURIComponent("[Portfolio Contact]")
             + "&body=" + encodeURIComponent(mail.value)
    ;
    window.location.href = link;
})

var git = document.getElementsByClassName("git")[0]

document.documentElement.addEventListener("click", function (e) {
    if (git !== e.target && !git.contains(e.target)) {return;}
  window.open("https://github.com/AustinFlap", "_blank")
})