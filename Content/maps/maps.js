var map;
var idInfoBoxAberto;
var infoBox = [];
var markers = [];
var markerClusterer = null;
var HCMCPos = new google.maps.LatLng(10.771971, 106.697845);

function initialize(inputId) {
    var latlng = HCMCPos;

    var options = {
        zoom: 5,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true
    };

    map = new google.maps.Map(document.getElementById(inputId), options);
}

function abrirInfoBox(id, marker) {
    if (typeof (idInfoBoxAberto) == 'number' && typeof (infoBox[idInfoBoxAberto]) == 'object') {
        infoBox[idInfoBoxAberto].close();
    }

    infoBox[id].open(map, marker);
    idInfoBoxAberto = id;
}

function clearClusters(e) {
    e.preventDefault();
    e.stopPropagation();
    if (markerClusterer) {
        infoBox = [];
        markers = [];
        markerClusterer.clearMarkers();
    }
}

function carregarPontos(pontos, allPontos) {
    var latlngbounds = new google.maps.LatLngBounds();

    $.each(pontos, function (index, item) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(item.Latitude, item.Longitude),
            animation: google.maps.Animation.DROP,
            title: item.Title,
            icon: 'Images/marker.png'
        });

        var myOptions = {
            content: "<div class='address'>" +
                                "<h5>" + item.Name + "</h5>" +
                                "<div class='clearfix'></div>" +
                                "<p>" + item.Address + "</p>" +
                                "<p>Tel: <a href='tel:" + item.Phone + "'>" + item.Phone + "</a></p>" +
                                "</div>",
            pixelOffset: new google.maps.Size(-150, -50)
        };

        infoBox[item.Id] = new InfoBox(myOptions);
        infoBox[item.Id].marker = marker;

        infoBox[item.Id].listener = google.maps.event.addListener(marker, 'click', function (e) {
            abrirInfoBox(item.Id, marker);
        });

        markers.push(marker);

        latlngbounds.extend(marker.position);

    });

    markerClusterer = new MarkerClusterer(map, markers);
    if (pontos.length <= 0) {
        map.setCenter(HCMCPos);
    } else {
        map.fitBounds(latlngbounds);
    }

}