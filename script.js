var url1 = "http://sandbox.gibm.ch/berufe.php";
var url2 = "http://sandbox.gibm.ch/klassen.php?beruf_id="
let datum = moment();


$(document).ready(getProfession());

// Set Local Storage
function setStorage() {
    localStorage.setItem("selectProfession", $('selectProfession option:selected').val());
    localStorage.setItem("selectClass", $('selectClass option:selected').val());

}

// Get Local Storage
function getStorage() {
    const selectProfession = localStorage.getItem("selectProfession");
    const selectClass = localStorage.getItem("selectClass");
}

// Funktion Berufe aus API anzeigen
function getProfession() {
    // jQuery Funktion um asynchron auf JSON Daten zuzugreifen
    $.getJSON(url1)
        // wenn der Request funktioniert hat
        .done(function (data) {
            // message leeren
            $('#message').empty();
            // select beruf leeren, Ihre Auswahl einfügen
            $('#selectProfession').empty().append('<option value="">Ihre Auswahl ...</option>');
            // loop über das JSON Array aus Objekten
            $.each(data, function (i, selectProfession) {
                // optionen einfügen
                $('<option value="' + selectProfession.beruf_id + '">' + selectProfession.beruf_name + '</option>').appendTo($('#selectProfession'));
            })
        })
        //keine Verbindung zum Server
        .fail(function () {
            $('#message').html('Keine Verbindung zum Server');
        });
}

$('#selectProfession').change(function () {
    // check if value is not empty or not null
    if ('#selectProfession' != null || '#selectProfession' != "") {
        console.log();
        getClass();
        $('#selectClass').fadeIn("slow", 2);
    }

})

// Funktion Klassen der jeweilgen Berufs ID zuweisen 
function getClass() {

    // mit val() auf value prop vom Beruf select zugreifen 
    $.getJSON(url2 + $('#selectProfession').val())
        // wenn der Request funktioniert hat
        .done(function (data) {
            // message leeren
            $('#message').empty();
            // select beruf leeren, Ihre Auswahl einfügen
            $('#selectClass').empty().append('<option value="">Ihre Auswahl ...</option>');
            // loop über das JSON Array aus Objekten
            $.each(data, function (i, selectClass) {
                // optionen einfügen
                $('<option value="' + selectClass.klasse_id + '">' + selectClass.klasse_name + '</option>').appendTo($('#selectClass'));
            })
        })
        // keine Verbindung zum Server
        .fail(function () {
            $('#message').html('Keine Verbindung zum Server');
        });
}

// Bei Klassenauswahl wird Tabellenfunktion aufgerufen 
$('#selectClass').change(function () {
    console.log();
    getClassTable();

})

function getClassTable() {

    // Formatiertes Datum und dessen Anzeige
    const datumAnzeige = datum.format("WW-YYYY");
    $('#currentWeek').val(datumAnzeige);
    $('#currentWeek').text(datumAnzeige);

    // Buttons für Stundenplan
    const page = '<div class="btn-group" role="group" aria-label="Basic example">' +
        '<button type="button" class="btn btn-dark" id="sub"> &lt; </button>' +
        '<button type="button" class="btn btn-dark" id="currentWeek">' + datum.format("WW-YYYY") + '</button>' +
        '<button type="button" class="btn btn-dark" id="add"> &gt; </button>' +
        '</div>';

    // löscht button wieder
    $('#selectDate').empty().append(page);

    // Ausführen des Backbuttons
    $('#sub').click(function () {
        datum.subtract(1, 'week');
        getClassTable();
    });

    //Ausführen des Addbuttons
    $('#add').click(function () {
        datum.add(1, 'week');
        getClassTable();
    });

    // Löscht Tabelle wieder
    $('#classTable').empty().append('<table class="table table-striped"><tr><th>Datum</th><th>Von</th><th>Bis</th><th>Lehrer</th><th>Fach</th><th>Raum</th></tr></table>');

    // Anzeige der Daten in der Tabelle
    $.getJSON('http://sandbox.gibm.ch/tafel.php?klasse_id=' + $('#selectClass').val() + '&woche=' + datumAnzeige)
        .done(function (data) {
            if (data.length > 2) {
                $.each(data, function (index, value) {
                    $('#classTable > table').append('<tr><td>' + value.tafel_datum + '</td><td>' + value.tafel_von + '</td><td>' + value.tafel_bis + '</td><td>' + value.tafel_lehrer + '</td><td>' + value.tafel_longfach + '</td><td>' + value.tafel_raum + '</td></tr>')
                })
            } else {
                $('#classTable > table').html('<div class="alert alert-info" role="alert">Kein Stundenplan für diese Woche</div>');
            }
        })
}




