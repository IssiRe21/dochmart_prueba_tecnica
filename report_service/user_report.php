<?php
/**
 * Crea un reporte PDF con la información de un usuario usando TCPDF
 */

// Include the main TCPDF library (search for installation path).
require_once('tcpdf.php');

// Valores del usuario (recibidos en el body)
$userId = $_POST["id"];
$name = $_POST["name"];
$email = $_POST["email"];
$createdAt = $_POST["createdAt"];

// Configuración de página y estilo
define("PDF_PAGE_ORIENTATION", "Portrait");
define("PDF_UNIT", "mm");
define("PDF_PAGE_FORMAT", "A4");
define("USE_UNICODE", true);
define("PDF_CREATOR", "Regina Arrieta");
define("PDF_AUTHOR", "Regina Arrieta");

// Header
$header_logo = '';
if (@file_exists('logo_dochmart.jpg')) {
    $header_logo = 'logo_dochmart.jpg';
}
define("PDF_HEADER_LOGO", $header_logo);
// define("PDF_HEADER_LOGO", "logo_dochmart.png");
define("PDF_HEADER_LOGO_WIDTH", 60);
define("PDF_HEADER_TITLE", "Reporte de Usuario " . $userId);
define("PDF_HEADER_STRING", "por Regina Arrieta");

// Fonts
define("PDF_FONT_NAME_MAIN", "sans-serif");
define("PDF_FONT_SIZE_MAIN", 11);
define("PDF_FONT_NAME_DATA", "sans-serif");
define("PDF_FONT_SIZE_DATA", 8);
define("PDF_FONT_MONOSPACED", "monospace");

// Márgenes
define("PDF_MARGIN_LEFT", 60);
define("PDF_MARGIN_TOP", 20);
define("PDF_MARGIN_RIGHT", 60);
define("PDF_MARGIN_BOTTOM", 20);
define("PDF_MARGIN_HEADER", 20);
define("PDF_MARGIN_FOOTER", 20);

// Imágenes
define("PDF_IMAGE_SCALE_RATIO", 1);

// Contenido
define("CONTENT_FONT_NAME", "helvetica");
define("CONTENT_FONT_SIZE", 14);



// Crear nuevo documento PDF
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, USE_UNICODE, 'UTF-8', false);

// Establecer información del documento
$pdf->SetCreator('Dochmart Prueba Técnica');
$pdf->SetAuthor('Regina Arrieta');
$pdf->SetTitle('Reporte de Usuario ' . $userId);
$pdf->SetSubject('Reporte de Usuario');
$pdf->SetKeywords('Dochmart, reporte, usuario');

// Configurar header
// Color de texto y línea basados en colores usados en www.dochmart.com
$headerTextColor = array(72,70,73); // #484649
$headerLineColor = array(193,193,193); // #c1c1c1
// TODO: Fix wrong header text
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING, $headerTextColor, $headerLineColor);
$footerTextColor = array(72,70,73); // #484649
$footerLineColor = array(193,193,193); // #c1c1c1
$pdf->setFooterData($footerTextColor, $footerLineColor);

// Configurar font de header y footer
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// Configurar font monospace
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// Establecer márgenes
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// Establecer saltos de página automáticos
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// Establecer factor de escala de imagen
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// ---------------------------------------------------------

// Establecer modo de subsetting default para font
$pdf->setFontSubsetting(true);

// Establecer font
$pdf->SetFont(CONTENT_FONT_NAME, '', CONTENT_FONT_SIZE, '', true);

// Agregar una página
$pdf->AddPage();

// Imprimir contenido (HTML)
$html = '<h1>Reporte de Usuario <span style="color:black;">'.$userId.'</span></h1>
<p>A continuación se muestra la información del usuario.</p>
<table cellpadding="1" cellspacing="1" border="1">
    <thead>
        <tr>
            <th style="text-align: center;">ID</th>
            <th style="text-align: center;">Nombre</th>
            <th style="text-align: center;">Email</th>
            <th style="text-align: center;">Fecha de Registro</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">'.$userId.'</td>
            <td style="text-align: left;">'.$name.'</td>
            <td style="text-align: left;">'.$email.'</td>
            <td style="text-align: left;">'.$createdAt.'</td>
        </tr>
    </tbody>
</table>';

// Imprimir html
$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);

// ---------------------------------------------------------

// Close and output PDF document
$pdf->Output('user_report_'.$userId.'.pdf', 'I');