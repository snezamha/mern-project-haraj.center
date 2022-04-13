import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CheckoutWizard({ activeStep = 0 }) {
  const { t } = useTranslation();

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {[t('common.authentication'),t('common.shippingAddress'), t('common.paymentMethod'), t('common.completeOrder')].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}