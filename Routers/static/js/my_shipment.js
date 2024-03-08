
function checkAuthentication() {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
        window.location.href = "/my_shipment";
    }
}

if (localStorage.getItem("token") === null) {
    window.location.href = "/";
}

$(document).ready(function () {
    const token = localStorage.getItem("token");
    fetch("/myshipment", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(data => {
        let shipment1 = "";
        for (let ship = 0; ship < data.length; ship++) {
            const shipment = data[ship];
            shipment1 = shipment1 + "<tr><td>"
                + shipment.Email + "</td><td>"
                + shipment.Shipment_Number + "</td><td>"
                + shipment.container_number + "</td><td>"
                + shipment.Route_details + "</td><td>"
                + shipment.Goods_types + "</td><td>"
                + shipment.Device + "</td><td>"
                + shipment.Expected_Delivery_date + "</td><td>"
                + shipment.Po_number + "</td><td>"
                + shipment.Delivery_number + "</td><td>"
                + shipment.Ndc_Number + "</td><td>"
                + shipment.Batch_id + "</td><td>"
                + shipment.Serial_number_of_goods + "</td><td>"
                + shipment.Shipment_Description + "</td></tr>";
        }
        $("#data").html(shipment1);
        // Search functionality
        $("#search").on("keyup", function () {
            var searchText = $(this).val().toLowerCase();
            $("#data tr").each(function () {
                var rowData = $(this).text().toLowerCase();
                if (rowData.includes(searchText)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    })

})

$(document).ready(function(){

    if (sessionStorage.getItem("role")==="admin"){

        $("#device").css("display","flex");

        $("#device").css("display","flex");

    }

});


