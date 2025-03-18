const supabase = require('../config/supabase');

/**
 * Create a new payment
 */

const createPayment = async (req, res) => {
    const { amount, cardNumber, flightId } = req.body;

    // Validate required fields
    if (!amount || !flightId || !cardNumber) {
        return res.status(400).json({ message: 'Missing required payment information' });
    }

    try {
        // Create payment in Supabase
        const { data, error } = await supabase
          .from('payments')
          .insert([{ amount, cardnumber: cardNumber, flightid: flightId }]);

        if (error) {
            console.error('Supabase Error:', error);
            return res.status(500).json({ message: 'Error creating payment', error });
        }

        console.log('Payment Created:', data);
        res.status(201).json({ message: 'Payment created successfully', payment: { amount, cardNumber, flightId } });
    } catch (err) {
        console.error('Unexpected Error:', err);
        res.status(500).json({ message: 'Unexpected error occurred', error: err });
    }
};

/**
 * Get all payments
 */
const getPayment = async (req, res) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*');

    if (error) {
        return res.status(500).json({ message: 'Error retrieving payments', error });
    }

    res.status(200).json({ payments: data });
};

module.exports = {
    createPayment,
    getPayment,
};
