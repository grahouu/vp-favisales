chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.message && (msg.message == "run")) {
        start()
    }
    return true;
});

let template_star_o = `<div class="fav_star" ope-id=""> <i class="fa fa-star-o fa-1" aria-hidden="true"></i> </div>`;
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
        let star_elem = $(this)
        let opeId = star_elem.attr("ope-id")
        let banners = $(".bannerWrapper[data-operation-id='"+opeId+"']")
        if (banners.length > 0 && $(banners[0]).attr("fav") == "false"){
            if (Object.keys(favorites).length == 0)
                $( "#topcarousel" ).after(template_wrapper);
            let newBanner = $(banners[0]).clone();
            newBanner.attr("fav", true);
            newBanner.css("display", "inline-block");
            newBanner.css("position", "");
            newBanner.css("transform", "");
            newBanner.css("margin-left", "20px");
            newBanner.css("margin-bottom", "20px");
            newBanner.find(".fa-star-o").replaceWith('<i class="fa fa-star fa-1" aria-hidden="true"></i>')
            $(banners[0]).find(".fa-star-o").replaceWith('<i class="fa fa-star fa-1" aria-hidden="true"></i>')
            clickElement(newBanner.find(".fav_star"));
            saveFav(opeId, newBanner)
            newBanner.appendTo("#favorites_list");
        }else if ($(banners[0]).attr("fav") == "true"){
            let idOpe = $(banners[0]).attr("data-operation-id")
            $($(".bannerWrapper[data-operation-id='"+opeId+"']")[1]).find(".fa-star").replaceWith('<i class="fa fa-star-o fa-1" aria-hidden="true"></i>')
            $(banners[0]).remove();
            saveFav(opeId)
            if (Object.keys(favorites).length == 0)
                $("#favorites").remove();
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
    if (Object.keys(favorites).length){
        $( "#topcarousel" ).after(template_wrapper);
        let wrapper_elem = $("#favorites_list")
        for (var property in favorites) {
            if (favorites.hasOwnProperty(property)) {
                let obj = $(favorites[property])
                clickElement(obj.find(".fav_star"))
                obj.appendTo(wrapper_elem);
            }
        }
    }
}

function addStar(elem){
    elem.attr("fav", false);
    let opId = elem.attr("data-operation-id")
    let obj_template_star;
    if (opId in favorites)
        obj_template_star = $(template_star)
    else
        obj_template_star = $(template_star_o)
    obj_template_star.attr("ope-id", opId)
    clickElement(obj_template_star);
    elem.find("#container").prepend(obj_template_star)
}

function start() {
    $('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');
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