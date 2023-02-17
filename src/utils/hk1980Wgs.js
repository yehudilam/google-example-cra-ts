export default function convert1980(Northing, Easting) {
  var E0 = 836694.05;
  var N0 = 819069.8;
  var Lng0 = 114.178556;
  var Lat0 = 22.312133;
  var m_0 = 1;
  var M0 = 2468395.723;
  var a = 6378388;
  var e2 = 6.722670022 * Math.pow(10, -3);

  var LngLat_HK1980 = CoorTransform_GridToGeographic(E0, N0, Lng0, Lat0, m_0, M0, a, e2, Easting, Northing, 7);

  var Lng_WGS84 = LngLat_HK1980[0] + (8.8 / 3600);
  var Lat_WGS84 = LngLat_HK1980[1] - (5.5 / 3600);

  return [Lat_WGS84, Lng_WGS84];
}

function CoorTransform_GridToGeographic(E0, N0, Lng0, Lat0, m_0, M0, a, e2, Easting, Northing, accuracy) {
  var A0 = 1 - (e2 / 4) - (3 * (Math.pow(e2, 2)) / 64);
  var A2 = (3 / 8) * (e2 + (Math.pow(e2, 2) / 4));
  var A4 = (15 / 256) * Math.pow(e2, 2);

  var Pi = 3.14159265;

  Lng0 = Lng0 * Pi / 180;
  Lat0 = Lat0 * Pi / 180;

  var E_Delta = Easting - E0;
  var N_delta = Northing - N0;
  var Mp = (N_delta + M0) / m_0;

  var Lat_min = -90 * Pi / 180;
  var Lat_max = 90 * Pi / 180;

  accuracy = Math.pow(10, -accuracy);

  var Lat_p = (Lat_max + Lat_min) / 2;
  var f = 1.1;

  while (Math.abs(f) > accuracy) {
    f = Mp - a * (A0 * Lat_p - A2 * Math.sin(2 * Lat_p) + A4 * Math.sin(4 * Lat_p));
    var f_d1 = -a * (A0 - A2 * 2 * Math.cos(2 * Lat_p) + A4 * 4 * Math.cos(4 * Lat_p));
    Lat_p = Lat_p - (f / f_d1);
  }

  var t_p = Math.tan(Lat_p);
  var v_p = a / (Math.sqrt(1 - e2 * Math.sin(Lat_p) * Math.sin(Lat_p)));
  var p_p = (a * (1 - e2)) / (Math.pow((1 - e2 * Math.sin(Lat_p) * Math.sin(Lat_p)), 1.5));
  var W_p = v_p / p_p;

  var Lng = Lng0 + (1 / Math.cos(Lat_p)) * (E_Delta / (m_0 * v_p)) - (1 / 6) * Math.pow((E_Delta / (m_0 * v_p)), 3) * (W_p + 2 * (t_p * t_p));
  var Lat = Lat_p - (t_p / ((m_0 * p_p))) * ((E_Delta * E_Delta) / ((2 * m_0 * v_p)));

  return [Lng / Pi * 180, Lat / Pi * 180];
}
