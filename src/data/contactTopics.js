export const contactTopics = [
  {
    value: 'beratung',
    label: 'Beratung allgemein',
    subject: 'Beratung allgemein',
  },
  {
    value: 'kachelofen-kaminbau',
    label: 'Kachelöfen & Kaminbau',
    subject: 'Kachelöfen & Kaminbau',
  },
  {
    value: 'fliesenarbeiten',
    label: 'Fliesenarbeiten',
    subject: 'Fliesenarbeiten',
  },
  {
    value: 'schornsteinbau',
    label: 'Schornsteinbau & Sanierung',
    subject: 'Schornsteinbau & Sanierung',
  },
  {
    value: '3d-planung',
    label: '3D-Planung & Entwürfe',
    subject: '3D-Planung & Entwürfe',
  },
  {
    value: 'sanierung',
    label: 'Sanierung & Bestand',
    subject: 'Sanierung & Bestand',
  },
  {
    value: 'rueckruf',
    label: 'Rückruf wünschen',
    subject: 'Rückruf wünschen',
  },
]

export function getContactTopic(value) {
  return contactTopics.find((topic) => topic.value === value) || contactTopics[0]
}

export function topicForService(slug) {
  if (slug === 'kachelofen-kaminbau') return getContactTopic('kachelofen-kaminbau')
  if (slug === 'schornsteinbau') return getContactTopic('schornsteinbau')
  if (slug === 'fliesenarbeiten') return getContactTopic('fliesenarbeiten')
  if (slug === '3d-planung') return getContactTopic('3d-planung')
  return contactTopics[0]
}
