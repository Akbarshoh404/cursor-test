import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../layout/Navigation';
import './PremiumPlans.css';

const PremiumPlans = () => {
  const { currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '1 Mock Test per week',
        'Basic Writing Practice',
        'Limited Study Resources',
        'Community Access',
        'Basic Progress Tracking'
      ],
      limitations: [
        'No AI Feedback',
        'No Speaking Practice',
        'No PDF Reports',
        'Limited Writing Prompts'
      ],
      popular: false,
      current: true
    },
    plus: {
      name: 'Plus',
      price: { monthly: 19, yearly: 190 },
      description: 'Most popular for serious students',
      features: [
        'Unlimited Mock Tests',
        'AI Writing Feedback',
        'Speaking Practice & Recording',
        'All Study Resources',
        'Advanced Progress Analytics',
        'PDF Test Reports',
        'Grammar Suggestion Tool',
        'Writing Templates',
        'Video Lessons Access',
        'Priority Support'
      ],
      limitations: [],
      popular: true,
      current: false
    },
    pro: {
      name: 'Pro',
      price: { monthly: 39, yearly: 390 },
      description: 'Everything you need to ace IELTS',
      features: [
        'Everything in Plus',
        'Human Expert Feedback',
        'Live Speaking Sessions',
        'Personal Study Plan',
        '1-on-1 Tutoring (2 sessions)',
        'Mock Speaking Test Booking',
        'Band 9 Model Answers',
        'Exam Day Coaching',
        'WhatsApp Support',
        'Score Guarantee*'
      ],
      limitations: [],
      popular: false,
      current: false
    }
  };

  const additionalServices = [
    {
      id: 'extra-tests',
      name: 'Extra Mock Tests',
      price: 10,
      description: 'Pack of 5 additional mock tests',
      icon: '📊'
    },
    {
      id: 'human-feedback',
      name: 'Human Writing Feedback',
      price: 25,
      description: 'Professional feedback on 3 essays',
      icon: '👨‍🏫'
    },
    {
      id: 'speaking-session',
      name: 'Live Speaking Session',
      price: 35,
      description: '1-hour session with certified instructor',
      icon: '🗣️'
    },
    {
      id: 'study-plan',
      name: 'Personal Study Plan',
      price: 15,
      description: 'Customized 30-day study roadmap',
      icon: '📋'
    }
  ];

  const examSupport = [
    { name: 'IELTS Academic', supported: true },
    { name: 'IELTS General', supported: true },
    { name: 'TOEFL iBT', supported: true, badge: 'New' },
    { name: 'CEFR Levels', supported: true },
    { name: 'SAT Reading/Writing', supported: true, badge: 'Beta' }
  ];

  const getDiscountPercentage = (monthly, yearly) => {
    if (monthly === 0) return 0;
    return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    if (planId !== 'free') {
      setShowPayment(true);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderPlanCard = (planId, plan) => {
    const isSelected = selectedPlan === planId;
    const price = plan.price[billingCycle];
    const discount = getDiscountPercentage(plan.price.monthly, plan.price.yearly);

    return (
      <div 
        key={planId}
        className={`plan-card ${isSelected ? 'selected' : ''} ${plan.popular ? 'popular' : ''} ${plan.current ? 'current' : ''}`}
        onClick={() => handlePlanSelect(planId)}
      >
        {plan.popular && <div className="popular-badge">Most Popular</div>}
        {plan.current && <div className="current-badge">Current Plan</div>}
        
        <div className="plan-header">
          <h3 className="plan-name">{plan.name}</h3>
          <div className="plan-price">
            <span className="price-amount">{formatPrice(price)}</span>
            {price > 0 && (
              <span className="price-period">
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            )}
          </div>
          {billingCycle === 'yearly' && discount > 0 && (
            <div className="discount-badge">Save {discount}%</div>
          )}
          <p className="plan-description">{plan.description}</p>
        </div>

        <div className="plan-features">
          <h4>Features Included:</h4>
          <ul className="features-list">
            {plan.features.map((feature, index) => (
              <li key={index} className="feature-item included">
                <span className="feature-icon">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          
          {plan.limitations.length > 0 && (
            <>
              <h4>Not Included:</h4>
              <ul className="features-list">
                {plan.limitations.map((limitation, index) => (
                  <li key={index} className="feature-item excluded">
                    <span className="feature-icon">✗</span>
                    {limitation}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="plan-footer">
          {plan.current ? (
            <button className="btn btn-secondary btn-lg" disabled>
              Current Plan
            </button>
          ) : (
            <button className="btn btn-primary btn-lg">
              {planId === 'free' ? 'Downgrade' : 'Upgrade Now'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPaymentModal = () => {
    if (!showPayment) return null;

    const plan = plans[selectedPlan];
    const price = plan.price[billingCycle];

    return (
      <div className="payment-modal-overlay" onClick={() => setShowPayment(false)}>
        <div className="payment-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Complete Your Subscription</h3>
            <button 
              className="close-btn"
              onClick={() => setShowPayment(false)}
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="order-summary">
              <h4>Order Summary</h4>
              <div className="summary-item">
                <span>Plan: {plan.name}</span>
                <span>{formatPrice(price)}/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="summary-item discount">
                  <span>Annual Discount</span>
                  <span>-{formatPrice(plan.price.monthly * 12 - plan.price.yearly)}</span>
                </div>
              )}
              <div className="summary-total">
                <span>Total</span>
                <span>{formatPrice(price)}</span>
              </div>
            </div>

            <div className="payment-methods">
              <h4>Payment Method</h4>
              <div className="payment-options">
                <div className="payment-option">
                  <input type="radio" id="card" name="payment" defaultChecked />
                  <label htmlFor="card">
                    <span className="payment-icon">💳</span>
                    Credit/Debit Card
                  </label>
                </div>
                <div className="payment-option">
                  <input type="radio" id="paypal" name="payment" />
                  <label htmlFor="paypal">
                    <span className="payment-icon">🅿️</span>
                    PayPal
                  </label>
                </div>
                <div className="payment-option">
                  <input type="radio" id="crypto" name="payment" />
                  <label htmlFor="crypto">
                    <span className="payment-icon">₿</span>
                    Cryptocurrency
                  </label>
                </div>
              </div>
            </div>

            <div className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  className="input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="input"
                />
              </div>
            </div>

            <div className="security-info">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span>SSL Encrypted & Secure</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🛡️</span>
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowPayment(false)}
            >
              Cancel
            </button>
            <button className="btn btn-success btn-lg">
              Subscribe Now - {formatPrice(price)}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="premium-plans">
      <Navigation />
      
      <div className="premium-content">
        <div className="premium-header">
          <h1>Choose Your Plan</h1>
          <p>Unlock your IELTS potential with our comprehensive preparation tools</p>
          
          <div className="billing-toggle">
            <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={billingCycle === 'yearly'}
                onChange={(e) => setBillingCycle(e.target.checked ? 'yearly' : 'monthly')}
              />
              <span className="slider"></span>
            </label>
            <span className={billingCycle === 'yearly' ? 'active' : ''}>
              Yearly <span className="save-badge">Save up to 20%</span>
            </span>
          </div>
        </div>

        <div className="plans-grid">
          {Object.entries(plans).map(([planId, plan]) => 
            renderPlanCard(planId, plan)
          )}
        </div>

        <div className="additional-services">
          <h2>Additional Services</h2>
          <p>Enhance your preparation with these add-on services</p>
          
          <div className="services-grid">
            {additionalServices.map(service => (
              <div key={service.id} className="service-card card">
                <div className="card-header">
                  <span className="service-icon">{service.icon}</span>
                  <h4>{service.name}</h4>
                </div>
                <div className="card-body">
                  <p>{service.description}</p>
                  <div className="service-price">{formatPrice(service.price)}</div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-secondary">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exam-support">
          <h2>Supported Exams</h2>
          <div className="exams-grid">
            {examSupport.map((exam, index) => (
              <div key={index} className="exam-item">
                <span className="exam-name">{exam.name}</span>
                {exam.badge && (
                  <span className={`exam-badge ${exam.badge.toLowerCase()}`}>
                    {exam.badge}
                  </span>
                )}
                <span className="exam-status">
                  {exam.supported ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I cancel my subscription anytime?</h4>
              <p>Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="faq-item">
              <h4>What's included in the score guarantee?</h4>
              <p>If you don't improve your score by at least 1 band after 30 days of active use, we'll refund your money.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer student discounts?</h4>
              <p>Yes! Students can get 20% off any plan with a valid student ID. Contact support for your discount code.</p>
            </div>
            <div className="faq-item">
              <h4>Can I switch plans later?</h4>
              <p>Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
          </div>
        </div>

        <div className="testimonials">
          <h2>What Our Students Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"PrepX helped me improve from Band 6.5 to 8.0 in just 6 weeks. The AI feedback is incredibly accurate!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍🎓</div>
                <div className="author-info">
                  <span className="author-name">Ahmed K.</span>
                  <span className="author-score">Band 8.0</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The speaking practice with AI was a game-changer. I felt confident on exam day!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍🎓</div>
                <div className="author-info">
                  <span className="author-name">Maria S.</span>
                  <span className="author-score">Band 7.5</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Best investment I made for IELTS prep. The human feedback on writing was invaluable."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍🎓</div>
                <div className="author-info">
                  <span className="author-name">David L.</span>
                  <span className="author-score">Band 8.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderPaymentModal()}
    </div>
  );
};

export default PremiumPlans;