$( document ).ready(function() {
  if ($('#transcript').value != "") {
    $("#submit-search").click(function(){
      console.log($('#transcript').val());
      sendAjaxQuery('doSearch',{"query":$('#transcript').val()})
    });
  }
});

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      recognition.stop();
      sendAjaxQuery('doSearch',{"query":document.getElementById('transcript').value})
      // document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

function sendAjaxQuery(url, data) {
      $.ajax({
          type: 'POST',
          url: url,
          data: data,
          dataType:'json',
          success: function (data) {
            var images = $('#images');
            images.empty();
            $.each(data.imageURLs,function(index,value){
              var figure = document.createElement('figure')
              figure.style.backgroundImage = 'url(' + value + ')'
              images.append(figure)
            })

          },
          error: function (xhr, status, error) {
              alert('Error: ' + error.message);
          }
      });
  }
