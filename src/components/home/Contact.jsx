import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const form = useRef()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitError('')

    // Get form data to verify it's being captured
    const formData = new FormData(form.current)
    const name = formData.get('from_name')
    const email = formData.get('from_email')
    const subject = formData.get('subject')
    const message = formData.get('message')

    // Basic validation
    if (!name || !email || !subject || !message) {
      setSubmitError('Please fill in all fields.')
      setIsSubmitting(false)
      return
    }

    console.log('Sending form data:', { name, email, subject, message })

    emailjs.sendForm(
      'service_k3a4wvj',
      'template_xtbfekn',
      form.current,
      '0aPQCkeqkbL9-6ft_'
    )
      .then((result) => {
        console.log('EmailJS Success:', result)
        setSubmitMessage('Your message has been sent successfully! I\'ll get back to you soon.')
        form.current.reset()
        setTimeout(() => setSubmitMessage(''), 7000)
      })
      .catch((error) => {
        console.error('EmailJS Error:', error)
        setSubmitError(`Failed to send message: ${error.text || 'Please try again.'}`)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section
      id="contact"
      style={{
        paddingTop: '4rem',
        paddingBottom: '6rem',
        backgroundColor: '#0f172a',
        color: '#e2e8f0'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          ref={ref}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
           <span style={{color:'#05F2EE'}}>Get in </span><span style={{ color: '#F23305' }}>Touch</span>
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#94a3b8' }}>
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </motion.div>

        {/* Side-by-side layout container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '2rem'
          }}
        >
          {/* Contact Info */}
          <motion.div
            style={{ flex: '1 1 45%' }}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#ffffff'
              }}
              variants={itemVariants}
            >
              Contact Information
            </motion.h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  icon: <FiMail size={24} />,
                  title: 'Email',
                  link: 'mailto:rajeshlingala26072005@gmail.com',
                  text: 'rajeshlingala26072005@gmail.com'
                },
                {
                  icon: <FiPhone size={24} />,
                  title: 'Phone',
                  link: 'tel:+919398207530',
                  text: '+91 93982 07530'
                },
                {
                  icon: <FiMapPin size={24} />,
                  title: 'Location',
                  text: 'Gundugolanu, Andhra Pradesh, India'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
                  variants={itemVariants}
                >
                  <div
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#1e293b',
                      borderRadius: '0.5rem',
                      color: '#3b82f6'
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 500, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                      {item.title}
                    </h4>
                    {item.link ? (
                      <a
                        href={item.link}
                        style={{ color: '#cbd5e1', textDecoration: 'none' }}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p style={{ color: '#cbd5e1' }}>{item.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: '#1e40af',
                borderRadius: '0.75rem',
                color: 'white'
              }}
              variants={itemVariants}
            >
              <h4 style={{ fontWeight: '500', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                Need a Developer?
              </h4>
              <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
                I'm currently available for freelance work and full-time positions.
              </p>
              <a
                href="mailto:rajeshlingala26072005@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Hire Me <FiSend />
              </a>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            style={{ flex: '1 1 45%' }}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#ffffff'
              }}
              variants={itemVariants}
            >
              Send Me a Message
            </motion.h3>

            <motion.form
              ref={form}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              variants={containerVariants}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '1.5rem'
                }}
              >
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="from_name"
                    style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="from_name"
                    name="from_name"
                    required
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #334155',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc'
                    }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="from_email"
                    style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="from_email"
                    name="from_email"
                    required
                    placeholder="Enter your email address"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #334155',
                      backgroundColor: '#1e293b',
                      color: '#f8fafc'
                    }}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="subject"
                  style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="What's this about?"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc'
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="message"
                  style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  placeholder="Tell me about your project or what you'd like to discuss..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    resize: 'none'
                  }}
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: 500,
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Sending...' : <>Send Message <FiSend /></>}
                </button>

                {submitMessage && (
                  <p style={{ marginTop: '1rem', color: '#10b981' }}>{submitMessage}</p>
                )}
                {submitError && (
                  <p style={{ marginTop: '1rem', color: '#ef4444' }}>{submitError}</p>
                )}
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
