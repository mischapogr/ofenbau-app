export const contactTopicReview = {
  approvedForLaunch: false,
  note: 'Contact form topics, displayed labels, email subjects and service-topic routing must be reviewed against the final operator intake workflow before launch.',
}

const pendingTopicApproval = {
  operatorApproved: false,
  mailboxRoutingApproved: false,
  note: 'Confirm this contact topic label and email subject match the final request handling workflow before launch.',
}

export const contactTopics = [
  {
    value: 'beratung',
    label: 'Beratung allgemein',
    subject: 'Beratung allgemein',
    review: { ...pendingTopicApproval },
  },
  {
    value: 'kachelofen-kaminbau',
    label: 'Kachelöfen & Kaminbau',
    subject: 'Kachelöfen & Kaminbau',
    review: { ...pendingTopicApproval },
  },
  {
    value: 'fliesenarbeiten',
    label: 'Fliesenarbeiten',
    subject: 'Fliesenarbeiten',
    review: { ...pendingTopicApproval },
  },
  {
    value: 'schornsteinbau',
    label: 'Schornsteinbau & Sanierung',
    subject: 'Schornsteinbau & Sanierung',
    review: { ...pendingTopicApproval },
  },
  {
    value: '3d-planung',
    label: '3D-Planung & Entwürfe',
    subject: '3D-Planung & Entwürfe',
    review: { ...pendingTopicApproval },
  },
  {
    value: 'sanierung',
    label: 'Sanierung & Bestand',
    subject: 'Sanierung & Bestand',
    review: { ...pendingTopicApproval },
  },
  {
    value: 'rueckruf',
    label: 'Rückruf wünschen',
    subject: 'Rückruf wünschen',
    review: { ...pendingTopicApproval },
  },
]

export const contactTopicRoutingReview = {
  approvedForLaunch: false,
  note: 'Service detail contact links and preselected contact topics must be checked against the final operator intake workflow before launch.',
}

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
