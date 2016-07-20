$( document ).ready(function() {
  if ($('#transcript').value != "") {
    $("#submit-search").click(function(){
      ajaxPost('doSearch',{"query":$('#transcript').val()}, function(data){
        var results = $('#search-results');
        results.empty();
        $.each(data.imageURLs,function(index,value){
          var figure = document.createElement('figure')
          figure.style.backgroundImage = 'url(' + value + ')'
          figure.className += "comic-thumbnail"
          results.append(figure)
        });
      });
    });
  }

  ajaxGet('getFeaturedComics',function(data){
    var store = $('.new-shelf');
    store.empty();
    $.each(data.imageURLs,function(index,value){
      var figure = document.createElement('figure')
      figure.style.backgroundImage = 'url(' + value + ')'
      figure.className += "comic-thumbnail"

      store.append(figure)
    });
  });
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
      ajaxPost('doSearch',{"query":document.getElementById('transcript').value}, function(data){
        var results = $('#search-results');
        results.empty();
        $.each(data.imageURLs,function(index,value){
          var figure = document.createElement('figure')
          figure.style.backgroundImage = 'url(' + value + ')'
          figure.className += "comic-thumbnail"

          results.append(figure)
        });
      });
      // document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

function ajaxPost(url, data, callback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType:'json',
        success: function (data) {
          callback(data);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
  }

  function ajaxGet(url, callback) {
      $.ajax({
          type: 'GET',
          url: url,
          dataType:'json',
          success: function (data) {
            callback(data)

          },
          error: function (xhr, status, error) {
              alert('Error: ' + error.message);
          }
      });
  }
