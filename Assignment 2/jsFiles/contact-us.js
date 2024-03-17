function doBindings(){
    $(".submit-btn").on("click",handleFormSubmission)
}
$(doBindings);
function handleFormSubmission(event){
    event.preventDefault();
    let flag = true;
    if ($("#fname").val() === ""){
        $("#fname").addClass("form-error")
        flag = false;
    }else{
        $("#fname").removeClass("form-error")
    }
    if ($("#lname").val() === ""){
        $("#lname").addClass("form-error")
        flag = false;
    }else{
        $("#lname").removeClass("form-error")
    }
    if ($("#email").val() === ""){
        $("#email").addClass("form-error")
        flag = false;
    }else{
        $("#email").removeClass("form-error")
    }
    if ($("#phone").val() === ""){
        $("#phone").addClass("form-error")
        flag = false;
    }else{
        $("#phone").removeClass("form-error")
    }
    if ($("#msg").val() === ""){
        $("#msg").addClass("form-error")
        flag = false;
    }else{
        $("#msg").removeClass("form-error")
    }
    if(flag){
        window,location.reload();
    }
}