const Paso3Envio = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleChange = e => {
    updateFormData({ direccion: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.direccion) nextStep();
    else alert("Ingresá una dirección de envío.");
  };

  return (
    <form onSubmit={handleNext} className="checkout-form">
      <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required />
      <div>
        <button type="button" onClick={prevStep}>Atrás</button>
        <button type="submit">Siguiente</button>
      </div>
    </form>
  );
};

export default Paso3Envio;
