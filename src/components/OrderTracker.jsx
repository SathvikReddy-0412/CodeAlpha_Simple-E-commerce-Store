import React from 'react';
import { ShoppingCart, Package, Truck, CheckCircle2 } from 'lucide-react';
import './OrderTracker.css';

export const OrderTracker = ({ currentStep = 2, status = "Processing" }) => {
  const steps = [
    { number: 1, label: "Order Placed", icon: ShoppingCart },
    { number: 2, label: "Processing", icon: Package },
    { number: 3, label: "Shipped & Out for Delivery", icon: Truck },
    { number: 4, label: "Delivered", icon: CheckCircle2 }
  ];

  return (
    <div className="order-tracker-root">
      <div className="tracker-header">
        <span className="status-label">Current Status:</span>
        <span className={`status-pill status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
          {status}
        </span>
      </div>

      <div className="tracker-steps-line">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <React.Fragment key={step.number}>
              <div className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="step-circle">
                  <Icon size={18} />
                </div>
                <span className="step-title">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${index + 1 < currentStep ? 'filled' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
