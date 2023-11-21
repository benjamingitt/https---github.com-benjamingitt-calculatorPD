const express = require('express');
const router = express.Router();

function calculette(expression) {
  const stack = [];

  for (let token of expression.split(' ')) {
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } else {
      const operand2 = stack.pop();
      const operand1 = stack.pop();

      switch (token) {
        case '+':
          stack.push(operand1 + operand2);
          break;
        case '-':
          stack.push(operand1 - operand2);
          break;
        case '*':
          stack.push(operand1 * operand2);
          break;
        case '/':
          stack.push(operand1 / operand2);
          break;
        default:
          throw new Error('Некорректное выражение');
      }
    }
  }

  return stack.pop();
}

router.post('/calculator', (req, res) => {
  const { expression } = req.body;

  if (!expression) {
    return res.status(400).json({ error: 'Выражение не предоставлено' });
  }

  try {
    const result = calculette(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
