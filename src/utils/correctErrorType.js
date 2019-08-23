const ErrorType = {}

ErrorType.action = {
  alert: '错误'
}

ErrorType.category = {
  Unknown: 'Unknown',
  Misspelled: 'Misspelled',
  Formatting: 'Formatting',
  Wordiness: 'Wordiness',
  AccidentallyConfused: 'AccidentallyConfused',
}

ErrorType.categoryHuman = {
  Unknown: 'Unknown',
  Misspelled: 'Misspelled Words',
  Formatting: 'Improper Formatting',
  Wordiness: 'Wordy Sentences',
  AccidentallyConfused: 'Confused Words', 
}

ErrorType.categoryHumanText = {
  Unknown: '未知错误',
  Misspelled: '拼错的单词',
  Formatting: '格式不正确',
  Wordiness: '冗长的句子',
  AccidentallyConfused: '混淆不清的单词',
}

ErrorType.categoryShap = {
  Unknown: 'line',
  Misspelled: 'polygon',
  Formatting: 'ellipse',
  Wordiness: 'line',
  AccidentallyConfused: 'rectangle',
}

ErrorType.categoryColor = {
  Unknown: 'red',
  Misspelled: 'red',
  Formatting: 'yellow',
  Wordiness: 'green',
  AccidentallyConfused: 'blue',
}

export default ErrorType