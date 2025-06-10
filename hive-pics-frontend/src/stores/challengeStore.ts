// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Define the Challenge interface
export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  tags: string[];
}

// Define the ChallengeSet interface
export interface ChallengeSet {
  id: string;
  name: string;
  description: string;
  challengeIds: string[];
}

export const useChallengeStore = defineStore('challenge', () => {
  // State
  const challenges = ref<Challenge[]>([])
  const challengeSets = ref<ChallengeSet[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getChallengeById = computed(() => (id: string) => {
    return challenges.value.find(challenge => challenge.id === id) || null
  })

  const getChallengeSetById = computed(() => (id: string) => {
    return challengeSets.value.find(set => set.id === id) || null
  })

  const getChallengesByTag = computed(() => (tag: string) => {
    return challenges.value.filter(challenge => challenge.tags.includes(tag))
  })

  const getChallengesInSet = computed(() => (setId: string) => {
    const set = getChallengeSetById.value(setId)
    if (!set) return []
    return set.challengeIds.map(id => getChallengeById.value(id)).filter(Boolean) as Challenge[]
  })

  // Actions
  function addChallenge (challenge: Challenge) {
    challenges.value.push(challenge)
  }

  function updateChallenge (updatedChallenge: Challenge) {
    const index = challenges.value.findIndex(c => c.id === updatedChallenge.id)
    if (index !== -1) {
      challenges.value[index] = updatedChallenge
    }
  }

  function removeChallenge (id: string) {
    challenges.value = challenges.value.filter(challenge => challenge.id !== id)
    // Also remove this challenge from any sets that contain it
    challengeSets.value.forEach(set => {
      set.challengeIds = set.challengeIds.filter(challengeId => challengeId !== id)
    })
  }

  function addChallengeSet (set: ChallengeSet) {
    challengeSets.value.push(set)
  }

  function updateChallengeSet (updatedSet: ChallengeSet) {
    const index = challengeSets.value.findIndex(s => s.id === updatedSet.id)
    if (index !== -1) {
      challengeSets.value[index] = updatedSet
    }
  }

  function removeChallengeSet (id: string) {
    challengeSets.value = challengeSets.value.filter(set => set.id !== id)
  }

  function addChallengeToSet (challengeId: string, setId: string) {
    const set = getChallengeSetById.value(setId)
    if (set && !set.challengeIds.includes(challengeId)) {
      set.challengeIds.push(challengeId)
    }
  }

  function removeChallengeFromSet (challengeId: string, setId: string) {
    const set = getChallengeSetById.value(setId)
    if (set) {
      set.challengeIds = set.challengeIds.filter(id => id !== challengeId)
    }
  }

  // Initialize with test data
  function initializeTestData () {
    // Sample challenges
    const testChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Group Selfie',
        description: 'Take a selfie with at least 3 other guests.',
        reward: 10,
        tags: ['fun', 'selfie', 'social'],
      },
      {
        id: '2',
        title: 'Venue Panorama',
        description: 'Capture a panoramic shot of the entire venue.',
        reward: 15,
        tags: ['venue', 'landscape'],
      },
      {
        id: '3',
        title: 'Dance Floor Action',
        description: 'Snap a photo of people dancing.',
        reward: 5,
        tags: ['fun', 'action', 'social'],
      },
      {
        id: '4',
        title: 'Romantic Moment',
        description: 'Capture a romantic moment between two people.',
        reward: 20,
        tags: ['romantic', 'emotional'],
      },
      {
        id: '5',
        title: 'Food Art',
        description: 'Take a creative photo of the food being served.',
        reward: 10,
        tags: ['food', 'creative'],
      },
      {
        id: '6',
        title: 'Sunset Shot',
        description: 'Capture the sunset at the event.',
        reward: 15,
        tags: ['nature', 'landscape', 'romantic'],
      },
      {
        id: '7',
        title: 'Funny Face',
        description: 'Take a photo of someone making a funny face.',
        reward: 5,
        tags: ['fun', 'humor'],
      },
      {
        id: '8',
        title: 'Candid Moment',
        description: 'Capture a genuine candid moment.',
        reward: 15,
        tags: ['candid', 'emotional'],
      },{
        id: '8',
        title: 'Candid Moment',
        description: 'Capture a genuine candid moment.',
        reward: 15,
        tags: ['candid', 'emotional'],
      },
      {
        id: '9',
        title: 'Das generationsübergreifende Bild',
        description: 'Findet die Person mit dem jüngsten und die mit dem ältesten Geburtsjahr auf der Feier und macht ein gemeinsames Foto von ihnen.',
        reward: 25,
        tags: ['family', 'generations', 'social', 'unique'],
      },
      {
        id: '10',
        title: 'Detail-Detektiv',
        description: 'Fotografiert das kleinste oder unscheinbarste Detail, das euch an der Dekoration oder den Geschenken auffällt.',
        reward: 15,
        tags: ['detail', 'creative', 'decoration'],
      },
      {
        id: '11',
        title: 'Die lachendste Gruppe',
        description: 'Sammelt mindestens fünf Leute und fangt ihren ehrlichsten und herzlichsten Lacher in einem Gruppenfoto ein.',
        reward: 20,
        tags: ['fun', 'social', 'emotion', 'group'],
      },
      {
        id: '12',
        title: 'Kulinarische Kunst',
        description: 'Macht ein appetitliches Foto vom Buffet oder von einem besonders schön angerichteten Teller.',
        reward: 10,
        tags: ['food', 'aesthetic', 'detail'],
      },
      {
        id: '13',
        title: 'Kinder-Chaos',
        description: 'Fangt einen lustigen oder herzerwärmenden Moment der Kinder beim Spielen oder Toben ein.',
        reward: 15,
        tags: ['children', 'fun', 'candid', 'family'],
      },
      {
        id: '14',
        title: 'Emotionale Momentaufnahme',
        description: 'Fotografiert einen Moment, der eine besondere Emotion (Freude, Rührung, Überraschung) einfängt – vielleicht eine Umarmung, ein Blick oder eine Geste.',
        reward: 20,
        tags: ['emotion', 'candid', 'heartfelt'],
      },
      {
        id: '15',
        title: 'Socken-Selfie',
        description: 'Alle Anwesenden, die mitmachen, stellen ihre Füße mit Socken in den Vordergrund und machen ein Selfie davon. Eine lustige Erinnerung!',
        reward: 10,
        tags: ['fun', 'selfie', 'creative', 'humor'],
      },
      {
        id: '16',
        title: 'Der Gruppen-Spiegel',
        description: 'Bildet eine Gruppe und macht ein Foto von euch, das sich in einem Spiegel, einer Scheibe oder einer anderen reflektierenden Oberfläche spiegelt.',
        reward: 15,
        tags: ['group', 'creative', 'perspective'],
      },
      {
        id: '17',
        title: 'Das "Ich-bin-dabei"-Selfie',
        description: 'Jede:r, der:die mitmacht, macht ein Selfie mit einem besonderen Gegenstand oder einer Person, die für die Tauffeier symbolisch ist (z.B. Taufkerze, Taufkleid, ein besonders dekoriertes Detail).',
        reward: 15,
        tags: ['selfie', 'symbolic', 'personal'],
      },
      {
        id: '18',
        title: 'Taufpate/Taufpatin-Porträt',
        description: 'Macht ein besonderes und individuelles Porträt vom Taufpaten oder der Taufpatin, das seine/ihre Persönlichkeit widerspiegelt.',
        reward: 20,
        tags: ['portrait', 'family', 'important person'],
      },
    ]

    // Sample challenge sets
    const testChallengeSets: ChallengeSet[] = [
      {
        id: '1',
        name: 'Wedding Essentials',
        description: 'Must-have photo challenges for any wedding.',
        challengeIds: ['1', '4', '6', '8'],
      },
      {
        id: '2',
        name: 'Party Fun',
        description: 'Fun challenges for a lively party.',
        challengeIds: ['1', '3', '7'],
      },
      {
        id: '3',
        name: 'Corporate Event',
        description: 'Professional photo challenges for business events.',
        challengeIds: ['2', '5', '8'],
      },
      {
        id: '4',
        name: 'Taufe',
        description: 'Besondere Foto-Challenges, um die Taufe deines Kindes festzuhalten.',
        challengeIds: [
          '9', // Das generationsübergreifende Bild
          '10', // Detail-Detektiv
          '11', // Die lachendste Gruppe
          '12', // Kulinarische Kunst
          '13', // Kinder-Chaos
          '14', // Emotionale Momentaufnahme
          '15', // Socken-Selfie
          '16', // Der Gruppen-Spiegel
          '17', // Das "Ich-bin-dabei"-Selfie
          '18', // Taufpate/Taufpatin-Porträt
        ],
      },
    ]

    challenges.value = testChallenges
    challengeSets.value = testChallengeSets
  }

  // Initialize test data on store creation
  initializeTestData()

  return {
    // State
    challenges,
    challengeSets,
    isLoading,
    error,

    // Getters
    getChallengeById,
    getChallengeSetById,
    getChallengesByTag,
    getChallengesInSet,

    // Actions
    addChallenge,
    updateChallenge,
    removeChallenge,
    addChallengeSet,
    updateChallengeSet,
    removeChallengeSet,
    addChallengeToSet,
    removeChallengeFromSet,
    initializeTestData,
  }
})
