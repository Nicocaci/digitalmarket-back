const Paso1Datos = ({ formData, updateFormData, nextStep }) => {
  const handleChange = e => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.email) nextStep();
    else alert("Completá todos los campos.");
  };

  return (
    <form onSubmit={handleNext} className="checkout-form">
      <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
      <button type="submit">Siguiente</button>
    </form>
  );
};

export default Paso1Datos;
