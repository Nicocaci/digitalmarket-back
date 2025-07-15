import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Paso1Datos from './Paso1Datos.jsx';
import Paso2Pago from './Paso2Pago.jsx';
import Paso3Envio from './Paso3Envio.jsx';
import Paso4Finalizar from './Paso4Fianlizar.jsx';
import '../css/Checkout.css';
import CheckoutStepper from './CheckoutStepper.jsx';

const CheckOut = () => {
    const { cart, total } = useCart();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
        metodoPago: ''
    });

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="checkout-container">
            <h2 className='titulo-checkout'>Finalizar Cómpra - Paso {step}</h2>
            <CheckoutStepper step={step} />
            {step === 1 && <Paso1Datos formData={formData} updateFormData={updateFormData} nextStep={nextStep} />}
            {step === 2 && <Paso2Pago formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && <Paso3Envio formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
            {step === 4 && <Paso4Finalizar formData={formData} cart={cart} total={total} prevStep={prevStep} />}
        </div>
    );
};

export default CheckOut;
