#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('App.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Modal JSX
modal_jsx = '''            
            {showAbout && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[110]">
                <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl mx-4 relative max-h-[80vh] overflow-y-auto">
                  <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Hakkımızda</h2>
                  <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                    <p><strong>PsikoWeb</strong>, 2020 yılında kurulan ve ruh sağlığına erişimi demokratikleştirmeyi amaçlayan bir dijital psikoloji platformudur. İstanbul merkezli ekibimiz, bireylerin psikolojik sorunlarıyla başa çıkmalarında onlara rehberlik etmek için çalışmaktadır.</p>
                    <p>Biz, her bireyin profesyonel psikolojik destek alması gereken bir hak olduğuna inanıyoruz. Teknoloji ve psikoloji bilimini bir araya getirerek, depresyon, anksiyete, stres ve ilişki sorunları gibi yaygın sorunlara çözüm sunuyoruz.</p>
                    <p><strong>Misyonumuz:</strong> Ruh sağlığına ilişkin bilgi eksikliğini gidermek, bireysel farkındalığı artırmak ve profesyonel destek alanına kapıları açmaktır.</p>
                    <p><strong>Vizyonumuz:</strong> Her insanın kendi iç huzurunu bulabilmesi için gerekli araçlara ve bilgiye erişebildiği bir dünya yaratmak.</p>
                    <p>Platformumuzda bulacağınız tüm içerikler, deneyimli psikologlar ve ruh sağlığı uzmanları tarafından dikkatle hazırlanmıştır. Yapay zeka destekli duygu tanıma teknolojimiz sayesinde, kişiselleştirilmiş tavsiyeler ve destek alabilirsiniz.</p>
                  </div>
                </div>
              </div>
            )}

'''

# Navigation satırından sonra modal'ı ekle
old_pattern = '<Navigation onAboutClick={() => setShowAbout(true)} />            {/* 3. Hero'
new_pattern = '<Navigation onAboutClick={() => setShowAbout(true)} />' + modal_jsx + '            {/* 3. Hero'

content = content.replace(old_pattern, new_pattern)

with open('App.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Modal added successfully!")
