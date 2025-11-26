'use client'

import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const ayurvedicDoctors = [
  {
    name: 'Dr. Konica Gera',
    credentials: 'BAMS, MD',
    role: 'Associate Professor',
    affiliation: 'SGT University (FIMS)',
    image: '/Konica.PNG',
  },
  {
    name: 'Dr. Abhilasha Bhardwaj',
    credentials: 'BAMS, MD',
    role: 'Assistant Professor',
    affiliation: 'SGT University (FIMS)',
    image: '/Abhilasha.PNG',
  },
]

const ayurvedicStudents = [
  {
    name: 'Vaibhav Sharma',
    role: 'BAMS Scholar at SGT University',
    image: '/Vaibhav.jpg',
  },
  {
    name: 'Jiwansh Bhayana',
    role: 'BAMS Scholar at SGT University',
    image: '/Jiwansh.jpg',
  },
  {
    name: 'Shreya Jain',
    role: 'BAMS Scholar at SGT University',
    image: '/Shreya.jpg',
  },
  {
    name: 'Tushar Singhal',
    role: 'BAMS Scholar at SGT University',
    image: '/Tushar.jpg',
  },
]

const techTeam = [
  {
    name: 'Aakash Bisht',
    role: 'SOET Scholar at SGT University',
    image: '/Aakash.jpg',
  },
  {
    name: 'Ayush Parashar',
    role: 'SOET Scholar at SGT University',
    image: '/Ayush.jpg',
  },
]

export function Team() {
  return (
    <section id="team" className="py-20 lg:py-32 bg-background">
      <div className="container">
        <div className="space-y-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-foreground sm:text-4xl lg:text-5xl mb-8"
          >
            Meet Our Team
          </motion.h2>

          {/* Ayurvedic Team */}
          <div className="space-y-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-center text-foreground sm:text-3xl"
            >
              Ayurvedic Team
            </motion.h3>

            {/* Doctors */}
            <div className="space-y-6">
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-4 text-xl font-semibold text-center text-foreground"
              >
                Doctors
              </motion.h4>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
                {ayurvedicDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={doctor.image} alt={doctor.name} />
                            <AvatarFallback>
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle className="text-xl">{doctor.name}</CardTitle>
                        <CardDescription className="text-base font-medium text-primary">
                          {doctor.credentials}
                        </CardDescription>
                        <CardDescription className="text-sm">
                          {doctor.role}
                        </CardDescription>
                        <CardDescription className="text-sm">
                          {doctor.affiliation}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Students */}
            <div className="space-y-6">
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-4 text-xl font-semibold text-center text-foreground"
              >
                Students
              </motion.h4>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {ayurvedicStudents.map((student, index) => (
                  <motion.div
                    key={student.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={student.image} alt={student.name} />
                            <AvatarFallback>
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle className="text-xl">{student.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {student.role}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Team */}
          <div className="space-y-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-center text-foreground sm:text-3xl mt-4 mb-4"
            >
              Tech Team
            </motion.h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
              {techTeam.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
