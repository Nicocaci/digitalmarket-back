
import '../css/NavBar.css'
function LogoAnimado() {
  return (
    <video
      src="/logogif.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="logo-animado"// Ajustá tamaño según necesites
    />
  );
}

export default LogoAnimado;
