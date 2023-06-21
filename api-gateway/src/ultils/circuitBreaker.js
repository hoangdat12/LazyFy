import * as CircuitBreaker from 'opossum';

const circuitBreakerOptions = {
  errorThresholdPercentage: 50, // Maximum percentage of failed requests before opening the circuit
  resetTimeout: 5000, // Time in milliseconds to wait before attempting to close the circuit again
  timeout: 3000, // Request timeout in milliseconds
  fallback: (req, res, err) => {
    res.status(500).send('Service unavailable');
  }, // Fallback response when the circuit is open or an error occurs
};

const circuit = new CircuitBreaker(request, circuitBreakerOptions);
export default circuit;
