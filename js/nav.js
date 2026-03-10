$(document).ready(function(){

  $(document).on("click", ".hamburger", function() {
    $(".nav-menu").toggleClass("active");
});

});

$(window).scroll(function(){
    if($(this).scrollTop() > 50){
        $(".navbar").addClass("scrolled");
    } else{
        $(".navbar").removeClass("scrolled");
    }
});

$(document).ready(function(){
  // Hamburger toggle
  $(".hamburger").click(function(){
    $(".nav-menu").toggleClass("active");
  });

  // Scroll effect (optional)
  $(window).scroll(function(){
    if($(this).scrollTop() > 50){
      $(".navbar").addClass("scrolled");
    } else{
      $(".navbar").removeClass("scrolled");
    }
  });
});