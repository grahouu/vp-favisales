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
let favorites = JSON.parse(localStorage.getItem("favorites")) || {}

function clickElement(myStar){
    myStar.click(function() {
        let favorites_list_elem = $("#favorites_list")
        let star_elem = $(this)
        let opeId = star_elem.attr("ope-id")
        let banner = $(".bannerWrapper[data-operation-id='"+opeId+"']").first()
        if (banner.attr("fav") == "false"){
            let newBanner = banner.clone();
            newBanner.attr("fav", true);
            newBanner.css("display", "inline-block");
            newBanner.css("position", "");
            newBanner.css("transform", "");
            newBanner.css("margin-left", "20px");
            newBanner.css("margin-bottom", "20px");
            clickElement(newBanner.find(".fav_star"));
            newBanner.appendTo(favorites_list_elem);
            saveFav(opeId, newBanner)
        }else if (banner.attr("fav") == "true"){
            let idOpe = banner.attr("data-operation-id")
            banner.remove();
            saveFav(opeId)
        }
    });
}

function saveFav(operationId, banner = null){
    if(operationId in favorites)
        delete favorites[operationId]
    else
        favorites[operationId] = banner.prop('outerHTML')

    localStorage.setItem("favorites", JSON.stringify(favorites))
}

function setFavorites(){
    let wrapper_elem = $("#favorites_list")

    for (var property in favorites) {
        if (favorites.hasOwnProperty(property)) {
            let obj = $(favorites[property])
            clickElement(obj.find(".fav_star"))
            obj.appendTo(wrapper_elem);
        }
    }
}

function addStar(elem){
    elem.attr("fav", false);
    let obj_template_star = $(template_star)
    obj_template_star.attr("ope-id", elem.attr("data-operation-id"))
    clickElement(obj_template_star);
    elem.find("#container").prepend(obj_template_star)
}

function start() {
    $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');
    $( "#topcarousel" ).after(template_wrapper);
    $(".bannerWrapper").each(function () {
        addStar($(this))
        $(this).find(".LazyLoad").bind("DOMSubtreeModified",function(e){
            e.stopPropagation();
            $(this).unbind(e);
            addStar($(this).parent())
        })
    });
    setFavorites();
}