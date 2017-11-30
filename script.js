chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.message && (msg.message == "run")) {
        start()
    }
    return true;
});

let template_star = `<div class="fav_star" ope-id=""> <i class="fa fa-star fa-1" aria-hidden="true"></i> </div>`;
let template_wrapper = `
<div class="wrapperSales" id="favorites">
    <div class="wrapperSalesHeader">
        <h1 class="wrapperSalesTitle">
            <i class="fa fa-star-o" aria-hidden="true"></i>
            <span>FAVORIS</span>
        </h1>
    </div>
    <div class="react-grid-layout layout" id="favorites_list" > </div>
</div>
`
let favorites = JSON.parse(localStorage.getItem("favorites")) || []

function clickElement(){
    $(".fav_star").click(function() {
        let favorites_list_elem = $("#favorites_list")
        let elem = $(this)
        let opeId = elem.attr("ope-id")
        let banner = $(".bannerWrapper[data-operation-id='"+opeId+"']").first()
        console.log(banner)
        if (banner.attr("fav") == "false"){
            let newElem = banner.clone();
            saveFav(opeId)
            newElem.attr("fav", true);
            newElem.css("display", "inline-block");
            newElem.css("position", "");
            newElem.css("transform", "");
            newElem.css("margin-left", "20px");
            newElem.css("margin-bottom", "20px");
            newElem.appendTo(favorites_list_elem);
            newElem.click(clickElement())
        }else if (banner.attr("fav") == "true"){
            banner.remove()
        }
        
    });
}

function saveFav(operationId){
    if (favorites.indexOf(operationId) < 0){
        favorites.push(operationId)
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }
}

function setFavorites(){
    let wrapper_elem = $("#favorites_list")
    favorites.forEach(function(opeId) {
        let banner = $(".bannerWrapper[data-operation-id='"+opeId+"']")
        console.log(banner.length)
        if (banner.length){
            let newElem = banner.clone();
            newElem.attr("fav", true);
            newElem.css("display", "inline-block");
            newElem.css("position", "");
            newElem.css("transform", "");
            newElem.css("margin-left", "20px");
            newElem.css("margin-bottom", "20px");
            newElem.appendTo(wrapper_elem);
            newElem.click(clickElement())
        }
    });
}

function start() {
    $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');
    $( "#topcarousel" ).after( template_wrapper );
    $(".bannerWrapper").each(function () {
        let elem = $(this)
        elem.attr("fav", false);
        let obj_template_star = $(template_star)
        obj_template_star.attr("ope-id", elem.attr("data-operation-id"))
        elem.find("#container").prepend(obj_template_star)
    });
    setFavorites();
    clickElement();
}