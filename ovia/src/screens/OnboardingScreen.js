import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

// All onboarding questions
const QUESTIONS = [
  {
    id: 'cycle_length',
    title: 'How long is your typical cycle?',
    subtitle: "Don't worry, you can change this later",
    type: 'cycle_picker',
    options: ['21-25 days', '26-30 days', '31-35 days', 'Not sure'],
    defaultOption: '26-30 days',
    defaultValue: 28,
    min: 21,
    max: 35,
  },
  {
    id: 'period_duration',
    title: 'How long does your period last?',
    subtitle: "We'll use this to track your flow",
    type: 'cycle_picker',
    options: ['1-3 days', '4-5 days', '6-7 days', 'Not sure'],
    defaultOption: '4-5 days',
    defaultValue: 5,
    min: 1,
    max: 10,
  },
  {
    id: 'last_period',
    title: 'When did your last period start?',
    subtitle: 'This helps us predict your next cycle',
    type: 'date_select',
    options: ['Today', 'Yesterday', '2 days ago', '3+ days ago'],
    defaultOption: 'Yesterday',
  },
  {
    id: 'goal',
    title: "What's your main goal?",
    subtitle: 'Choose all that apply',
    type: 'multi_select',
    options: ['Track my cycle', 'Manage PCOS/PCOD', 'Plan a pregnancy', 'General health'],
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(QUESTIONS[0].defaultOption);
  const [scrollValue, setScrollValue] = useState(QUESTIONS[0].defaultValue || 28);
  const scrollRef = useRef(null);

  const question = QUESTIONS[currentStep];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnswers({ ...answers, [question.id]: option });
  };

  const handleContinue = () => {
    setAnswers({ ...answers, [question.id]: scrollValue || selectedOption });
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(QUESTIONS[currentStep + 1].defaultOption || '');
      setScrollValue(QUESTIONS[currentStep + 1].defaultValue || null);
    } else {
      // Navigate to main app
      // navigation.replace('Home');
      alert('Onboarding complete! Navigate to Home.');
    }
  };

  const handleSkip = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {QUESTIONS.map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === currentStep ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );

  const renderCyclePicker = () => {
    const items = [];
    for (let i = question.min; i <= question.max; i++) {
      items.push(i);
    }

    return (
      <View style={styles.pickerContainer}>
        {/* Option chips */}
        <View style={styles.optionsGrid}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionChip,
                selectedOption === option && styles.optionChipActive,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option && styles.optionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scroll number picker */}
        <View style={styles.numberPickerWrapper}>
          {/* Ghost rows above */}
          <Text style={styles.ghostNumber}>{scrollValue - 1}</Text>
          {/* Selected number */}
          <View style={styles.selectedRow}>
            <Text style={styles.selectedNumber}>{scrollValue}</Text>
            <Text style={styles.daysLabel}>DAYS</Text>
          </View>
          {/* Ghost row below */}
          <Text style={styles.ghostNumber}>{scrollValue + 1}</Text>

          {/* Down arrow */}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowDown}>⌄</Text>
            <Text style={styles.scrollAdjustText}>SCROLL TO ADJUST</Text>
          </View>

          {/* Touch zones */}
          <TouchableOpacity
            style={styles.upTouchZone}
            onPress={() => setScrollValue(Math.max(question.min, scrollValue - 1))}
          />
          <TouchableOpacity
            style={styles.downTouchZone}
            onPress={() => setScrollValue(Math.min(question.max, scrollValue + 1))}
          />
        </View>
      </View>
    );
  };

  const renderOptions = () => (
    <View style={styles.optionsGrid}>
      {question.options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionChip,
            selectedOption === option && styles.optionChipActive,
          ]}
          onPress={() => handleOptionSelect(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.optionTextActive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header row: dots + skip */}
        <View style={styles.header}>
          {renderDots()}
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{question.title}</Text>
          <Text style={styles.questionSubtitle}>{question.subtitle}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {question.type === 'cycle_picker' ? renderCyclePicker() : renderOptions()}
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Continue  →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff5f9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#ff4d88',
    width: 18,
  },
  dotInactive: {
    backgroundColor: '#e9c4d4',
  },
  skipText: {
    color: '#cd75a1',
    fontSize: 15,
    fontWeight: '500',
  },
  questionContainer: {
    marginBottom: 28,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 6,
    lineHeight: 30,
  },
  questionSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  optionChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f5d7e6',
    minWidth: '44%',
    alignItems: 'center',
  },
  optionChipActive: {
    backgroundColor: '#ff4db8',
    borderColor: '#ff4dbe',
  },
  optionText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  pickerContainer: {
    alignItems: 'center',
  },
  numberPickerWrapper: {
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    position: 'relative',
  },
  ghostNumber: {
    fontSize: 20,
    color: '#CCC',
    fontWeight: '300',
    lineHeight: 36,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6e7f5',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    width: '85%',
    justifyContent: 'center',
    marginVertical: 4,
  },
  selectedNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ff4dac',
  },
  daysLabel: {
    fontSize: 12,
    color: '#cd75b6',
    letterSpacing: 1.5,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  arrowContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  arrowDown: {
    fontSize: 20,
    color: '#db9dc8',
    lineHeight: 18,
  },
  scrollAdjustText: {
    fontSize: 9,
    color: '#db9dd8',
    letterSpacing: 1.5,
    fontWeight: '500',
    marginTop: 2,
  },
  upTouchZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
  },
  downTouchZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
  },
  continueBtn: {
    backgroundColor: '#ff4dca',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#ff4daf',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});