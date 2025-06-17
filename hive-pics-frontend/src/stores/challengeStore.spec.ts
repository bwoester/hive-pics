import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { type Challenge, type ChallengeSet, useChallengeStore } from './challengeStore'

describe('Challenge Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia())
  })

  describe('State', () => {
    it('should initialize with test data', () => {
      const store = useChallengeStore()

      // Check if challenges array is populated
      expect(store.challenges.length).toBeGreaterThan(0)

      // Check if challengeSets array is populated
      expect(store.challengeSets.length).toBeGreaterThan(0)

      // Check initial loading and error states
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    it('should get challenge by id', () => {
      const store = useChallengeStore()
      const challenge = store.getChallengeById('1')

      expect(challenge).not.toBeNull()
      expect(challenge?.title).toBe('Group Selfie')
    })

    it('should return null for non-existent challenge id', () => {
      const store = useChallengeStore()
      const challenge = store.getChallengeById('non-existent-id')

      expect(challenge).toBeNull()
    })

    it('should get challenge set by id', () => {
      const store = useChallengeStore()
      const set = store.getChallengeSetById('1')

      expect(set).not.toBeNull()
      expect(set?.name).toBe('Wedding Essentials')
    })

    it('should return null for non-existent challenge set id', () => {
      const store = useChallengeStore()
      const set = store.getChallengeSetById('non-existent-id')

      expect(set).toBeNull()
    })

    it('should get challenges by tag', () => {
      const store = useChallengeStore()
      const challenges = store.getChallengesByTag('fun')

      expect(challenges.length).toBeGreaterThan(0)
      for (const challenge of challenges) {
        expect(challenge.tags).toContain('fun')
      }
    })

    it('should get challenges in a set', () => {
      const store = useChallengeStore()
      const challenges = store.getChallengesInSet('1')

      expect(challenges.length).toBeGreaterThan(0)

      // Get the set to verify
      const set = store.getChallengeSetById('1')
      expect(set).not.toBeNull()

      // Check that all challenges in the result are in the set's challengeIds
      for (const challenge of challenges) {
        expect(set?.challengeIds).toContain(challenge.id)
      }
    })

    it('should return empty array for non-existent set id', () => {
      const store = useChallengeStore()
      const challenges = store.getChallengesInSet('non-existent-id')

      expect(challenges).toEqual([])
    })
  })

  describe('Actions', () => {
    it('should add a challenge', () => {
      const store = useChallengeStore()
      const initialCount = store.challenges.length

      const newChallenge: Challenge = {
        id: 'new-id',
        title: 'New Challenge',
        description: 'Test description',
        reward: 10,
        tags: ['test'],
      }

      store.addChallenge(newChallenge)

      expect(store.challenges.length).toBe(initialCount + 1)
      expect(store.getChallengeById('new-id')).toEqual(newChallenge)
    })

    it('should update a challenge', () => {
      const store = useChallengeStore()
      const originalChallenge = store.getChallengeById('1')
      expect(originalChallenge).not.toBeNull()

      const updatedChallenge: Challenge = {
        ...originalChallenge!,
        title: 'Updated Title',
        description: 'Updated Description',
      }

      store.updateChallenge(updatedChallenge)

      const retrievedChallenge = store.getChallengeById('1')
      expect(retrievedChallenge?.title).toBe('Updated Title')
      expect(retrievedChallenge?.description).toBe('Updated Description')
    })

    it('should remove a challenge', () => {
      const store = useChallengeStore()
      const initialCount = store.challenges.length

      // Add the challenge to a set to test removal from sets
      if (!store.getChallengeSetById('1')?.challengeIds.includes('2')) {
        store.addChallengeToSet('2', '1')
      }

      store.removeChallenge('2')

      expect(store.challenges.length).toBe(initialCount - 1)
      expect(store.getChallengeById('2')).toBeNull()

      // Check that the challenge was also removed from sets
      const set = store.getChallengeSetById('1')
      expect(set?.challengeIds).not.toContain('2')
    })

    it('should add a challenge set', () => {
      const store = useChallengeStore()
      const initialCount = store.challengeSets.length

      const newSet: ChallengeSet = {
        id: 'new-set-id',
        name: 'New Set',
        description: 'Test set description',
        challengeIds: ['1', '3'],
      }

      store.addChallengeSet(newSet)

      expect(store.challengeSets.length).toBe(initialCount + 1)
      expect(store.getChallengeSetById('new-set-id')).toEqual(newSet)
    })

    it('should update a challenge set', () => {
      const store = useChallengeStore()
      const originalSet = store.getChallengeSetById('1')
      expect(originalSet).not.toBeNull()

      const updatedSet: ChallengeSet = {
        ...originalSet!,
        name: 'Updated Set Name',
        description: 'Updated set description',
      }

      store.updateChallengeSet(updatedSet)

      const retrievedSet = store.getChallengeSetById('1')
      expect(retrievedSet?.name).toBe('Updated Set Name')
      expect(retrievedSet?.description).toBe('Updated set description')
    })

    it('should remove a challenge set', () => {
      const store = useChallengeStore()
      const initialCount = store.challengeSets.length

      store.removeChallengeSet('3')

      expect(store.challengeSets.length).toBe(initialCount - 1)
      expect(store.getChallengeSetById('3')).toBeNull()
    })

    it('should add a challenge to a set', () => {
      const store = useChallengeStore()
      const setId = '2'
      const challengeId = '5' // Food Art challenge

      // Make sure the challenge is not already in the set
      const originalSet = store.getChallengeSetById(setId)
      if (originalSet?.challengeIds.includes(challengeId)) {
        originalSet.challengeIds = originalSet.challengeIds.filter(id => id !== challengeId)
      }

      store.addChallengeToSet(challengeId, setId)

      const updatedSet = store.getChallengeSetById(setId)
      expect(updatedSet?.challengeIds).toContain(challengeId)
    })

    it('should not add a duplicate challenge to a set', () => {
      const store = useChallengeStore()
      const setId = '1'
      const challengeId = '1' // Already in the set

      const originalSet = store.getChallengeSetById(setId)
      const originalLength = originalSet?.challengeIds.length || 0

      store.addChallengeToSet(challengeId, setId)

      const updatedSet = store.getChallengeSetById(setId)
      expect(updatedSet?.challengeIds.length).toBe(originalLength)
    })

    it('should remove a challenge from a set', () => {
      const store = useChallengeStore()
      const setId = '1'
      const challengeId = '1'

      // Make sure the challenge is in the set
      const originalSet = store.getChallengeSetById(setId)
      expect(originalSet?.challengeIds).toContain(challengeId)

      store.removeChallengeFromSet(challengeId, setId)

      const updatedSet = store.getChallengeSetById(setId)
      expect(updatedSet?.challengeIds).not.toContain(challengeId)
    })

    it('should reinitialize test data', () => {
      const store = useChallengeStore()

      // Modify the store data
      store.removeChallenge('1')
      store.removeChallengeSet('1')

      // Reinitialize
      store.initializeTestData()

      // Check that data is restored
      expect(store.getChallengeById('1')).not.toBeNull()
      expect(store.getChallengeSetById('1')).not.toBeNull()
    })
  })
})
