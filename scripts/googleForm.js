var POST_URL = "https://asia-northeast1-artistake-prod.cloudfunctions.net/createArtist";
function onFormSubmit(e) {
  var form = FormApp.getActiveForm();
  var allResponses = form.getResponses();
  var latestResponse = allResponses[allResponses.length - 1];
  var response = latestResponse.getItemResponses();
  var images = ["avatar", "thumbnail", "banner", "gallery", "shop"];
  var mapping = {
    ID: "id",
    "Artist Name": "name",
    Description: "description",
    AboutMyWork: "aboutMyWork",
    walletAddress: "walletAddress",
    "avatar.png (or .jpg)": "avatar",
    "thumbnail.png (or .jpg)": "thumbnail",
    "banner.png (or .jpg)": "banner",
    "gallery.png (or .jpg)": "gallery",
    "shop.png (or .jpg)": "shop",
    galleryUrl: "galleryUrl",
    shopUrl: "shopUrl",
  };
  var payload = {};
  for (var i = 0; i < response.length; i++) {
    var question = response[i].getItem().getTitle();
    var answer = response[i].getResponse();
    var key = mapping[question];
    if (key) {
      if (images.includes(key)) {
        payload[key] = answer[0];
      } else {
        payload[key] = answer;
      }
    }
  }
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(POST_URL, options);
}
